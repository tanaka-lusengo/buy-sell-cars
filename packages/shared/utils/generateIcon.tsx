export const generateIcon = (type: string, isSolid: boolean = true) => (
  <i
    className={`fa-${isSolid ? "solid" : "regular"} fa-${type} `}
    aria-hidden="true"
    title={type}
  ></i>
);
