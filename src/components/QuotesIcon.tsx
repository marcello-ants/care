function QuotesIcon() {
  return (
    <div data-testid="quotes-icon">
      <svg width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="a"
          mask-type="alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="32"
          height="32">
          <rect
            x=".5"
            y="31.5"
            width="31"
            height="31"
            rx="15.5"
            transform="rotate(-90 .5 31.5)"
            fill="#F5F5F5"
            stroke="#979797"
          />
        </mask>
        <g mask="url(#a)">
          <mask
            id="b"
            mask-type="alpha"
            maskUnits="userSpaceOnUse"
            x="-1"
            y="0"
            width="34"
            height="34">
            <path fill="#fff" d="M-1 0h34v34H-1z" />
          </mask>
          <g mask="url(#b)">
            <path fill="#E6E8EA" d="M-1.327 0h34v34h-34z" />
          </g>
        </g>
        <path
          d="M21.037 16.694c.017-.108.034-.206.05-.29.324-1.8 1.183-3.498 2.497-4.93.767-.84-.61-2.03-1.385-1.183v-.001c-1.377 1.463-2.35 3.17-2.846 4.999-.376 1.45-.827 3.802.04 5.18 1.478 2.348 7.419-.763 5.06-3.237h-.001c-.818-.887-2.28-1.118-3.415-.538zM11.143 16.694l.05-.29c.325-1.8 1.184-3.498 2.498-4.93.767-.84-.61-2.03-1.385-1.183v-.001c-1.377 1.463-2.35 3.17-2.846 4.999-.376 1.45-.828 3.802.04 5.18 1.478 2.348 7.419-.763 5.06-3.237h-.002c-.817-.887-2.279-1.118-3.414-.538z"
          fill="#B3BAC1"
        />
        <path
          d="M23.463 16.695c-.784-.646-1.892-.869-2.903-.62.36-1.573 1.15-3.058 2.317-4.33l.001-.002c.271-.297.368-.65.316-.989a1.353 1.353 0 0 0-.465-.808c-.233-.2-.54-.338-.87-.346a1.238 1.238 0 0 0-.957.421l.055.062c-1.301 1.452-2.506 3.312-2.992 5.101l-.001.005c-.19.735-.405 1.715-.458 2.695-.053.97.047 2.003.548 2.797.466.742 1.271 1.02 2.084 1.02.81 0 1.686-.27 2.422-.696.732-.422 1.38-1.028 1.673-1.741.15-.363.209-.757.132-1.161-.077-.405-.285-.792-.624-1.147l-.262-.275-.016.014zM13.57 16.695c-.784-.646-1.893-.869-2.903-.62.36-1.573 1.15-3.058 2.317-4.33l.001-.002c.271-.297.368-.65.316-.989a1.353 1.353 0 0 0-.465-.808c-.233-.2-.54-.338-.87-.346a1.238 1.238 0 0 0-.957.421l.055.062c-1.301 1.452-2.506 3.312-2.992 5.101l-.001.005c-.19.735-.405 1.715-.458 2.695-.053.97.047 2.003.548 2.797.466.743 1.271 1.02 2.084 1.02.81 0 1.686-.27 2.422-.696.732-.422 1.38-1.028 1.673-1.741.15-.363.209-.757.132-1.161-.077-.405-.285-.792-.624-1.147l-.262-.275-.016.014z"
          stroke="#213F5F"
          strokeWidth=".8"
        />
      </svg>
    </div>
  );
}

QuotesIcon.defaultProps = { className: '' };

export default QuotesIcon;