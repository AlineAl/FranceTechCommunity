import { useState, useEffect } from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

interface IPagination {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: IPagination) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = isMobile ? 1 : 3;

    let startPage = currentPage;
    if (startPage + maxPagesToShow - 1 > totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`flex items-center justify-center cursor-pointer h-10 w-10 md:h-12 md:w-12 mx-0.5 md:mx-1 rounded-md text-sm md:text-base
                        ${
                          currentPage === i
                            ? "bg-[#4C40CF] text-white"
                            : "text-[#4C40CF] bg-white border border-[#4C40CF]"
                        }`}
        >
          {i}
        </button>,
      );
    }

    return pageNumbers;
  };

  return (
    <nav
      aria-label="pagination"
      className="flex items-center justify-center my-6 md:my-10 px-2"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center cursor-pointer text-sm font-bold h-10 md:h-12 px-2 md:px-5.5 mr-0.5 md:mr-1 rounded-md leading-tight text-[#4C40CF] bg-white border border-[#4C40CF] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LuArrowLeft className="text-lg" />
        <span className="ml-1 md:ml-2 hidden md:inline">Page précédente</span>
      </button>

      <span className="flex items-center text-sm font-bold gap-0.5 md:gap-1 mx-1 md:mx-2">
        {renderPageNumbers()}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center text-sm font-bold justify-center h-10 md:h-12 px-2 md:px-5.5 ml-0.5 md:ml-1 rounded-md leading-tight text-[#4C40CF] bg-white border border-[#4C40CF] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="mr-1 md:mr-2 hidden md:inline">Page suivante</span>
        <LuArrowRight className="text-lg" />
      </button>
    </nav>
  );
};
