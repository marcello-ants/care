import { useCallback } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useAppDispatch, useFlowState, useSeekerCCState } from '@/components/AppState';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';
import { logChildCareEvent } from '@/utilities/childCareAnalyticsHelper';
import { generateIbChildrenDOB } from '@/utilities/gqlPayloadHelper';
import { ChildDOB } from '@/types/seekerCC';
import { FLOWS } from '@/constants';
import { convertDateToISOString } from '@/utilities/dobHelper';

export type MutualChildrenFormValues = {
  expecting: boolean;
  distanceLearning: boolean;
};

const minDate = new Date('1900-01-01');
const maxDate = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 12,
  new Date().getDate()
);
const DOBFormErrorMessage = 'Oops! Enter valid MM/YYYY format';

export const DOBFormSchema = yup.object({
  expecting: yup.bool().required(),
  childrenDOB: yup.array().when('expecting', {
    is: false,
    then: yup.array(yup.date().min(minDate).max(maxDate).required()),
  }),
  distanceLearning: yup.boolean().required(),
});

export type ChildrenDOBFormValues = MutualChildrenFormValues & {
  childrenDOB: ChildDOB[];
};

export const useDOBInputForm = () => {
  const { flowName } = useFlowState();
  const { goNext } = useFlowNavigation();
  const dispatch = useAppDispatch();
  const isIBFlow = flowName === FLOWS.SEEKER_INSTANT_BOOK.name;
  const {
    careExpecting,
    careChildrenDOB,
    distanceLearning,
    enrollmentSource,
    instantBook: { distanceLearning: ibDistanceLearning, children },
  } = useSeekerCCState();

  const ibChildrenDOB = children.map((child) => child.dateOfBirth);
  const childDOBvalue = isIBFlow ? ibChildrenDOB : careChildrenDOB;
  const distanceLearningValue = isIBFlow ? ibDistanceLearning : distanceLearning;

  const formik = useFormik<ChildrenDOBFormValues>({
    initialValues: {
      expecting: careExpecting,
      childrenDOB: childDOBvalue.length ? childDOBvalue : [null],
      distanceLearning: distanceLearningValue,
    },
    validationSchema: DOBFormSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit(values, formikHelper) {
      formikHelper.setSubmitting(false);

      if (isIBFlow) {
        const formatedChildren = generateIbChildrenDOB(values.childrenDOB);
        dispatch({
          type: 'cc_setIbChildrenDOB',
          children: formatedChildren,
          distanceLearning: values.distanceLearning,
        });
      } else {
        dispatch({
          type: 'setCareChildrenDOB',
          careChildrenDOB: values.childrenDOB,
          careExpecting: values.expecting,
          distanceLearning: values.distanceLearning,
        });
      }

      logChildCareEvent('Member Enrolled', 'Care Details', enrollmentSource, {
        number_of_kids: values.childrenDOB.length,
        ageList: values.childrenDOB,
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        distance_learning: validateDistanceLearning() ? values.distanceLearning : null,
      });

      goNext();
    },
  });

  const { childrenDOB } = formik.values;

  const validateDistanceLearning = useCallback(() => {
    const isOlderThanFourYears = (childDOB: string): boolean => {
      const forYearsAgo = new Date().setFullYear(new Date().getFullYear() - 4);
      const dateOfBirth = new Date(childDOB).getTime();

      return dateOfBirth < forYearsAgo;
    };

    return childrenDOB.some((childDOB: ChildDOB): boolean => {
      if (!childDOB) {
        return false;
      }

      return isOlderThanFourYears(childDOB);
    });
  }, [childrenDOB]);

  const consolidateDistanceLearning = () => {
    const shouldHaveDistanceLearning = validateDistanceLearning();

    if (!shouldHaveDistanceLearning) {
      formik.setFieldValue('distanceLearning', false);
    }
  };

  const handleNext = useCallback(() => {
    formik.handleSubmit();
  }, []);

  const handleAddChild = () => {
    const newChildren = [...childrenDOB, null];

    formik.setFieldValue('childrenDOB', newChildren);
    consolidateDistanceLearning();
  };

  const handleDeleteChild = (index: number) => {
    const newChildren = childrenDOB
      .slice(0, index)
      .concat(childrenDOB.slice(index + 1, childrenDOB.length));

    formik.setFieldValue('childrenDOB', newChildren);
  };
  const handleAgeChange = useCallback((fieldName: string, value: any) => {
    const fieldValue = value ? convertDateToISOString(value.$d) : null;
    formik.setFieldValue(fieldName, fieldValue);
    consolidateDistanceLearning();
  }, []);
  const handleDistanceLearningChange = useCallback((fieldName: string, value: string) => {
    formik.setFieldValue(fieldName, value === 'yes');
  }, []);

  const isNextDisabled = formik.isSubmitting;
  const childrenErrorMessage = formik.errors.childrenDOB && DOBFormErrorMessage;
  const errorMessage = formik.errors.expecting || childrenErrorMessage;

  return {
    formikDOB: formik,
    isNextDisabledDOB: isNextDisabled,
    errorMessageDOB: errorMessage,
    validateDistanceLearningDOB: validateDistanceLearning,
    handleAddChildDOB: handleAddChild,
    handleDeleteChildDOB: handleDeleteChild,
    handleNextDOB: handleNext,
    handleAgeChangeDOB: handleAgeChange,
    handleDistanceLearningChangeDOB: handleDistanceLearningChange,
  };
};
