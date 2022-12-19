import { CSSProperties, ReactChild, useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { TextConcernType } from '@/__generated__/globalTypes';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    zIndex: 0,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    textSizeAdjust: 'none',
    pointerEvents: 'none',
    color: 'transparent',
    lineHeight: '22px',
    overflow: 'hidden',
    margin: 0,
    '& mark': {
      background: theme.palette.care?.red[100],
      boxShadow: `0 1px 0 ${theme.palette.care?.red[800]}`,
      mixBlendMode: 'multiply',
      padding: 0,
      textStroke: 'thin black',
    },
    '& + div': {
      position: 'relative',
      mixBlendMode: 'multiply',
    },
  },
  text: {
    border: 'none !important',
  },
}));

export type GenericDetectedEntity = {
  __typename: 'DetectedEntity';
  text: string;
  type: TextConcernType;
  startIndex: number;
  endIndex: number;
};

interface highlighterProps {
  children: ReactChild;
  text: string;
  hlWords: GenericDetectedEntity[];
}

export const textToHLChunks = (text: string, hlWords: GenericDetectedEntity[]) => {
  const chunks = [];
  let index = 0;

  hlWords
    .slice()
    .sort((a, b) => a.startIndex - b.startIndex)
    .forEach((hl) => {
      const matchIndex = text.indexOf(hl.text, index);

      // this splits string into array consisting of a) matched words, b) text between matched words
      if (matchIndex >= 0) {
        if (matchIndex !== index) {
          chunks.push(text.substring(index, matchIndex));
        }
        chunks.push(hl.text);
        index = matchIndex + hl.text.length;
      }
    });

  if (index !== text.length) {
    chunks.push(text.substring(index));
  }

  return chunks;
};

const Highlighter = (props: highlighterProps) => {
  const { children, text, hlWords } = props;
  const classes = useStyles();
  const [style, setStyle] = useState({
    width: 0,
    height: 0,
    font: '',
    marginLeft: 0,
    marginTop: 0,
    whiteSpace: 'unset' as CSSProperties['whiteSpace'],
  });
  const [scroll, setScroll] = useState({});

  const highlighted = useMemo(() => {
    const words = hlWords.map((item) => item.text);
    return textToHLChunks(text, hlWords).map((word, i) => {
      if (words.includes(word)) {
        return word
          .split('')
          .map((letter, j) => (
            <mark key={`${word}-${i.toString()}-${j.toString()}`}>{letter}</mark>
          ));
      }

      return <span>{word}</span>;
    });
  }, [hlWords, text]);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let target: HTMLTextAreaElement | null;
    let copyStyles: () => void;
    let observer: ResizeObserver | null;

    if (ref?.current && ref.current.nextSibling) {
      target = (ref?.current?.nextSibling as Element)?.querySelector('textarea, input');
      if (target) {
        copyStyles = () => {
          if (!target || !ref?.current) return;
          const computedStyle = getComputedStyle(target);
          const hlComputedStyle = getComputedStyle(ref.current);
          const { left: tLeft, top: tTop } = target.getBoundingClientRect();
          const { left: hlLeft, top: hlTop } = ref.current.getBoundingClientRect();

          setStyle({
            marginLeft:
              tLeft -
              (hlLeft - parseInt(hlComputedStyle.marginLeft, 10)) +
              // avoid rendering over padding since text isn't rendered over padding in input during scroll
              parseInt(computedStyle.paddingLeft, 10),
            marginTop:
              tTop -
              (hlTop - parseInt(hlComputedStyle.marginTop, 10)) +
              parseInt(computedStyle.paddingTop, 10),
            width:
              target?.clientWidth -
              parseInt(computedStyle?.paddingLeft, 10) -
              parseInt(computedStyle?.paddingRight, 10),
            // extra 5px to fit underline, since it will be cut in a div that has same size as input
            height: target?.clientHeight - parseInt(computedStyle?.paddingTop, 10) + 5,
            font: computedStyle?.font || '',
            whiteSpace: target.nodeName === 'TEXTAREA' ? 'pre-wrap' : 'pre',
          });
          setScroll({
            marginTop: -(target?.scrollTop || 0),
            marginLeft: -(target?.scrollLeft || 0),
          });
        };
        target.addEventListener('scroll', copyStyles);

        // alternative way to handle scroll in safari since it might not fire event
        if (target.nodeName === 'INPUT') {
          target.addEventListener('keyup', copyStyles);
        }

        observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(copyStyles) : null;
        if (observer) observer.observe(target);
        copyStyles();
      }
    }
    return () => {
      if (target) {
        target.removeEventListener('scroll', copyStyles);
        target.removeEventListener('keyup', copyStyles);
        if (observer) observer.unobserve(target);
      }
    };
  }, [ref?.current?.nextSibling]);
  return (
    <>
      {/* prettier-ignore */}
      <div className={classes.container} ref={ref} style={style} aria-hidden
        ><div className={classes.text} style={scroll}>{highlighted}</div></div>
      {children}
    </>
  );
};

export default Highlighter;
