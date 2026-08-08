/**
 * Loại bỏ dấu tiếng Việt khỏi chuỗi
 * @param {string} str - Chuỗi cần loại bỏ dấu
 * @returns {string} - Chuỗi không dấu
 */
export const removeDiacritics = (str) => {
  if (!str) return '';
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

/**
 * Kiểm tra xem query có nằm trong text hay không, không phân biệt hoa thường và dấu tiếng Việt
 * @param {string} text - Văn bản gốc
 * @param {string} query - Chuỗi tìm kiếm
 * @returns {boolean} - true nếu có match
 */
export const matchSearch = (text, query) => {
  if (text === null || text === undefined || query === null || query === undefined) return false;
  if (query.trim() === '') return true;
  
  const normalizedText = removeDiacritics(String(text)).toLowerCase();
  const normalizedQuery = removeDiacritics(String(query)).toLowerCase();
  
  return normalizedText.includes(normalizedQuery);
};
