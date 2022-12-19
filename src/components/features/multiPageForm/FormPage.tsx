import { ReactElement, useEffect } from 'react';
import { useFormikContext } from 'formik';

interface FormPageProps {
  children: ReactElement;
}

function FormPage({ children }: FormPageProps) {
  const { validateForm } = useFormikContext();

  useEffect(() => {
    validateForm();
  }, []);

  return children;
}

export default FormPage;
