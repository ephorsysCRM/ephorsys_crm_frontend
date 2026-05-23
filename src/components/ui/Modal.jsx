import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  // Modal Sizes
  const modalSizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="
            fixed inset-0 z-9999
            flex items-center justify-center
            bg-black/60 backdrop-blur-sm
            p-4
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Modal */}
          <motion.div
            className={`
              w-full ${modalSizes[size]}
              rounded-3xl
              bg-white
              shadow-2xl
              overflow-hidden
              flex flex-col
              max-h-[90vh]
              border border-[var(--primary-100)]
            `}
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="
                flex items-center justify-between
                px-6 py-2
                shrink-0
                border-b border-[var(--primary-100)]
                from-[var(--primary-50)]
                to-white
              "
            >
              <div>
                <h2 className="text-lg md:text-xl font-bold text-[var(--primary-700)]">
                  {title}
                </h2>
              </div>

              {showCloseButton && (
                <motion.button
                  whileHover={{
                    rotate: 90,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  onClick={onClose}
                  className="
                  p-2
                    rounded-full
                    flex items-center justify-center
                    border border-[var(--primary-100)]
                    text-black-500
                    hover:text-red-500
                    hover:border-red-200
                    cursor-pointer
                    shadow-sm
                  "
                >
                  <X size={18} />
                </motion.button>
              )}
            </div>

            {/* Body */}
            <div
              className="
                p-6
                overflow-y-auto
                flex-1
                bg-white
              "
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>
                {`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>

              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;


// User

{/* <Modal
  isOpen={viewOpen}
  onClose={() => setViewOpen(false)}
  title="View Product"
  size="xl"
>
  <ViewProductModal
    productId={selectedProduct?._id}
  />
</Modal> */}