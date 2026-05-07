import React from 'react'
import './PaginationControl.css'

/**
 * PaginationControl Component
 * 
 * Displays a "Load More" button for pagination.
 * Manages loading state and handles pagination triggers.
 */
export default function PaginationControl({ hasMore, isLoading, onLoadMore }) {
  if (!hasMore) {
    return null
  }

  return (
    <div className="pagination-control">
      <button 
        className="load-more-btn"
        onClick={onLoadMore}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Loading...
          </>
        ) : (
          'Load More'
        )}
      </button>
    </div>
  )
}
