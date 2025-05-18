'use client';

import { JSX, useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { EmblaCarouselType } from 'embla-carousel';

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
  PrevButton: () => JSX.Element;
  NextButton: () => JSX.Element;
};

export const usePrevNextCarouselFunctions = (
  emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onSelect]);

  const PrevButton = () => (
    <ArrowLeft
      size={35}
      style={{
        transition: 'all 0.3s ease-in-out',
        color: prevBtnDisabled ? 'grey' : 'black',
        cursor: prevBtnDisabled ? 'default' : 'pointer',
      }}
      onClick={onPrevButtonClick}
    />
  );

  const NextButton = () => (
    <ArrowRight
      size={35}
      style={{
        transition: 'all 0.3s ease-in-out',
        color: nextBtnDisabled ? 'grey' : 'black',
        cursor: nextBtnDisabled ? 'default' : 'pointer',
      }}
      onClick={onNextButtonClick}
    />
  );

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
    PrevButton,
    NextButton,
  };
};
