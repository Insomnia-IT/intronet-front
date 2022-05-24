import React from "react";
import styles from "../map-element.module.css";

export const MapIcons = {
  camping: (
    <g transform="translate(-15,-15)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        className={styles.hoverOnly}
        d="M14.375 0V6.66667H15.625V0H14.375ZM30 14.375H23.3333V15.625H30V14.375ZM6.66667 14.375H0V15.625H6.66667V14.375ZM7.06199 12.3886L0.902791 9.83737L1.38114 8.68252L7.54034 11.2337L7.06199 12.3886ZM29.0972 9.83737L22.938 12.3886L22.4597 11.2337L28.6189 8.68252L29.0972 9.83737ZM11.2328 7.54019L8.68161 1.38099L9.83646 0.902638L12.3877 7.06183L11.2328 7.54019ZM21.3172 1.38099L18.7659 7.54019L17.6111 7.06183L20.1623 0.902638L21.3172 1.38099ZM8.66603 9.54945L3.95198 4.8354L4.83586 3.95152L9.54991 8.66557L8.66603 9.54945ZM26.0486 4.8354L21.3346 9.54945L20.4507 8.66557L25.1647 3.95152L26.0486 4.8354Z"
        fill="#57C7FE"
      />
      <path
        d="M27.5 15C27.5 21.9036 21.9036 28.75 15 28.75C8.09644 28.75 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15Z"
        fill="#57C7FE"
      />
      <path d="M15 10L7.5 21.25H22.5L15 10Z" fill="white" />
      <path
        d="M17.5 6.25L7.5 21.25H22.5L12.5 6.25"
        stroke="white"
        fill="none"
        strokeWidth="1.25"
      />
      <path d="M15 22.5H11.25L15 15L18.75 22.5H15Z" fill="#57C7FE" />
      <circle
        cx="15"
        cy="28.75"
        r="2.5"
        className={styles.selectedOnly}
        fill="white"
        stroke="#36ADFE"
        strokeWidth="1.25"
      />
    </g>
  ),
  cinema: (
    <g transform="translate(-12,-14)">
      <circle cx="12" cy="12" r="10" fill="#5A2EE9" />
      <path d="M10 15L6 13V17L10 15Z" fill="white" />
      <circle cx="10.5" cy="9.5" r="2.5" fill="white" />
      <circle cx="16" cy="10" r="2" fill="white" />
      <rect x="8" y="13" width="10" height="4" rx="1" fill="white" />
    </g>
  ),
};
