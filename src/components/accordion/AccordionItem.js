import { useState } from "react";

const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <div className="accordion-item">
        <h2 className="accordion-heading flex items-center h-10">
          <button
            className="accordion-button flex justify-between items-center w-full"
            type="button"
            onClick={toggleAccordion}
            aria-expanded={isOpen}
          >
            {title}
            <svg
              className={`accordion-icon ${isOpen ? 'rotate-180' : ''}`}
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5L5 1L1 5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </h2>
        {isOpen && (
          <div className="accordion-content">
            {content}
          </div>
        )}
      </div>
    );
}

export default AccordionItem;