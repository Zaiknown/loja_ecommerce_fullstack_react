// src/components/Paginate.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, keyword = '' }) => {
  if (pages <= 1) {
    return null; // Não mostra a paginação se houver apenas 1 página
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
      {[...Array(pages).keys()].map((x) => (
        <Link
          key={x + 1}
          to={keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}`}
          style={{
            margin: '0 5px',
            padding: '10px 15px',
            border: '1px solid #ddd',
            backgroundColor: x + 1 === page ? '#3498db' : 'transparent',
            color: x + 1 === page ? 'white' : 'inherit',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          {x + 1}
        </Link>
      ))}
    </div>
  );
};

export default Paginate;
