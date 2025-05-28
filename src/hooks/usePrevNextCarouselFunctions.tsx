"use client";

import { JSX, useCallback, useEffect, useState } from "react";
import { EmblaCarouselType } from "embla-carousel";

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
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  const PrevButton = () => (
    <i
      className="fa-solid fa-arrow-left fa-xl"
      aria-hidden="true"
      title="Arrow Left"
      style={{
        transition: "all 0.3s ease-in-out",
        color: prevBtnDisabled ? "grey" : "black",
        cursor: prevBtnDisabled ? "default" : "pointer",
      }}
      onClick={onPrevButtonClick}
    ></i>
  );

  const NextButton = () => (
    <i
      className="fa-solid fa-arrow-right fa-xl"
      aria-hidden="true"
      title="Arrow Right"
      style={{
        transition: "all 0.3s ease-in-out",
        color: nextBtnDisabled ? "grey" : "black",
        cursor: nextBtnDisabled ? "default" : "pointer",
      }}
      onClick={onNextButtonClick}
    ></i>
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
