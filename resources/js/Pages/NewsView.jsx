import React, { useEffect, useState } from 'react';
import Layout from '../Shared/Layout';
import { usePage, router } from '@inertiajs/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const NewsView = () => {
  // Getting data From The Props..
  const pageData = usePage().props;
  const paginationLinks = pageData.news.links;

  // Setup Of State Variables...
  const [articles, setArticles] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ source: "", author: "", publishedAt: "" });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [visibleColumns, setVisibleColumns] = useState({
    source: true,
    author: true,
    title: true,
    description: true,
    publishedAt: true,
    content: true,
    url: true,
    image: true,
  });

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }
    return 0;
  });

  const filteredArticles = sortedArticles.filter((article) => {
    const query = searchQuery.toLowerCase();
    const filterSource = filters.source.toLowerCase();
    const filterAuthor = filters.author.toLowerCase();
    const filterPublishedAt = filters.publishedAt.toLowerCase();

    return (
      (article.title.toLowerCase().includes(query) ||
        article.source.name.toLowerCase().includes(query) ||
        article.author?.toLowerCase().includes(query) ||
        new Date(article.publishedAt).toLocaleString().toLowerCase().includes(query)) &&
      article.source.name.toLowerCase().includes(filterSource) &&
      article.author?.toLowerCase().includes(filterAuthor) &&
      new Date(article.publishedAt).toLocaleString().toLowerCase().includes(filterPublishedAt)
    );
  });

  const handleColumnToggle = (column) => {
    setVisibleColumns((prevColumns) => ({
      ...prevColumns,
      [column]: !prevColumns[column],
    }));
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return ' ↕';
  };

  const handlePageChange = async (pageUrl) => {
    if (!pageUrl) return;

    try {
      router.get(pageUrl, {}, {
        preserveState:true,
        onSuccess: (page) => {
          const newsData = page.props.news.data;
          const result = Object.values(newsData).map((value, index) => (value));
          setArticles(result);
        },
      })
    } catch (error) {
      console.error("Error fetching page data:", error);
    }
    
  };

  useEffect(()=>{
    setArticles(Array.isArray(pageData.news.data) ? pageData.news.data : []);
  },[]);

  //  Debouncer
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);
  

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchInput}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded shadow mb-4"
        />
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            name="source"
            placeholder="Filter by source"
            value={filters.source}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded shadow"
          />
          <input
            type="text"
            name="author"
            placeholder="Filter by author"
            value={filters.author}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded shadow"
          />
          <input
            type="datetime-local"
            name="publishedAt"
            placeholder="Filter by published date"
            value={filters.publishedAt}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded shadow"
          />
        </div>
        <div className="flex space-x-4 mb-4">
          {Object.keys(visibleColumns).map((column) => (
            <label key={column} className="flex items-center">
              <input
                type="checkbox"
                checked={visibleColumns[column]}
                onChange={() => handleColumnToggle(column)}
                className="mr-2"
              />
              {column.charAt(0).toUpperCase() + column.slice(1)}
            </label>
          ))}
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {visibleColumns.source && (
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('source.name')}>
                Source{getSortSymbol('source.name')}
              </th>
            )}
            {visibleColumns.author && (
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('author')}>
                Author{getSortSymbol('author')}
              </th>
            )}
            {visibleColumns.title && (
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('title')}>
                Title{getSortSymbol('title')}
              </th>
            )}
            {visibleColumns.description && (
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('description')}>
                Description{getSortSymbol('description')}
              </th>
            )}
            {visibleColumns.publishedAt && (
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('publishedAt')}>
                Published At{getSortSymbol('publishedAt')}
              </th>
            )}
            {visibleColumns.content && (
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('content')}>
                Content{getSortSymbol('content')}
              </th>
            )}
            {visibleColumns.url && (
              <th className="py-2 px-4 border-b cursor-pointer">
                URL
              </th>
            )}
            {visibleColumns.image && (
              <th className="py-2 px-4 border-b cursor-pointer">
                Image
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {
            filteredArticles.length < 0 ? 
              filteredArticles.map((article, index) => (
                <tr key={index} className="border-b">
                  {visibleColumns.source && (
                    <td className="py-2 px-4 text-center">{article.source.name ? article.source.name  : 'No Source available'}</td>
                  )}
                  {visibleColumns.author && (
                    <td className="py-2 px-4 text-center">{article.author ? article.author : 'Author Not Found'}</td>
                  )}
                  {visibleColumns.title && (
                    <td className="py-2 px-4 text-center">{article.title ? article.title : '-'}</td>
                  )}
                  {visibleColumns.description && (
                    <td className="py-2 px-4 text-center">{article.description ? article.description  : '-'}</td>
                  )}
                  {visibleColumns.publishedAt && (
                    <td className="py-2 px-4 text-center">{article.publishedAt ? new Date(article.publishedAt).toLocaleString() : '-'}</td>
                  )}
                  {visibleColumns.content && (
                    <td className="py-2 px-4 text-center">{article.content ? article.content.slice(0, 100) + '...' : 'No content available'}</td>
                  )}
                  {visibleColumns.url && (
                    <td className="py-2 px-4 text-center">
                      <a href={article.url} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                        Read more
                      </a>
                    </td>
                  )}
                  {visibleColumns.image && (
                    <td className="py-2 px-4 text-center">
                        {article.urlToImage ? 
                          <LazyLoadImage
                            src={article.urlToImage}
                            alt={`Image Not Found`}
                            className="w-24 h-24 object-cover mx-auto"
                            effect="blur"
                            loading='lazy'
                        /> : 'Image Not Found'}
                    </td>
                  )}
                </tr>
              ))
            :
            (
              <tr>
                <td colSpan={Object.keys(visibleColumns).length} className="py-4 text-center">
                  No News Found
                </td>
              </tr>
            )  
          }
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        {paginationLinks?.map((link, index) => (
            link.url === null ? (
              <div
                  key={`link-${index}`}
                  className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded"
                  dangerouslySetInnerHTML={{ __html: link.label }}
              ></div>
          ) : (
          <button
            key={index}
            onClick={() => handlePageChange(link.url)}
            className={`px-4 py-2 mx-1 border ${link.active ? 'bg-blue-500 text-white' : 'bg-white'}`}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />)
        ))}
      </div>
    </div>
  );
};

export default NewsView;
NewsView.layout = page => <Layout children={page} />;
