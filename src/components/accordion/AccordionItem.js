import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMedia } from "../../redux/actions/media.action";

const AccordionItem = ({ conversationId, title, content }) => {
    const auth = useSelector(state => state.auth);
    const media = useSelector(state => state.media);
    const [isOpen, setIsOpen] = useState(false);
    const [firstOpen, setFirstOpen] = useState(false)
    const dispatch = useDispatch()
  
    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

    useEffect(() => {
      setIsOpen(false)
      setFirstOpen(false)
    },[conversationId])

    useEffect(() => {
      const getMediaData = async () => {
        if (firstOpen) return;
        if (title === 'Media files' && isOpen && !firstOpen) {
          if (media.every(md => md.conversationId !== conversationId)) {
            setFirstOpen(true)
            await dispatch(getMedia({ auth, id: conversationId }))
          }
        } 
      }
      getMediaData()
    },[title, isOpen, firstOpen, media, conversationId, auth, dispatch])
  
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