import React from 'react';

export default function Heart({ filled }) {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 1024 1024"
      data-aut-id="icon"
      fill={filled ? "red" : "none"} // Red for liked, no fill for unliked
      stroke={filled ? "red" : "black"} // Stroke color when not filled
      strokeWidth="40px" // Add stroke width for unliked heart
      fillRule="evenodd"
    >
      <path
        d={filled ? 
          // Filled heart path
          "M923.6 197.9c-49.9-51.1-118.1-79.2-190-79.2-71.9 0-140.1 28.1-190 79.2l-31.6 32.3-31.6-32.3C380.4 146.8 312.2 118.7 240.3 118.7c-71.9 0-140.1 28.1-190 79.2-104.8 107.3-104.8 282.7 0 390L512 896l461.6-481.2c104.7-107.3 104.7-282.7 0-390z" :
          // Outlined heart path
          "M830.798 448.659l-318.798 389.915-317.828-388.693c-20.461-27.171-31.263-59.345-31.263-93.033 0-85.566 69.605-155.152 155.152-155.152 72.126 0 132.752 49.552 150.051 116.364h87.777c17.299-66.812 77.905-116.364 150.051-116.364 85.547 0 155.152 69.585 155.152 155.152 0 33.687-10.802 65.862-30.293 91.811z"
        }
      />
    </svg>
  );
}
