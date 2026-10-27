// TOPIC: Hooks deep dive - Custom hook with useReducer for complex filter state
import { useReducer, useMemo } from 'react';

// TOPIC: Hooks deep dive (useReducer) - Reducer for managing filter actions
const filterReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload, page: 1 };
    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload, page: 1 };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'RESET_FILTERS':
      return {
        search: '',
        category: 'all',
        priceRange: 'all',
        dateRange: 'all',
        page: 1,
      };
    default:
      return state;
  }
};

const initialState = {
  search: '',
  category: 'all',
  priceRange: 'all', // all, free, paid
  dateRange: 'all', // all, today, week, month
  page: 1,
};

export function useEventFilters() {
  const [filters, dispatch] = useReducer(filterReducer, initialState);

  // TOPIC: Hooks deep dive (useMemo) - Memoize filter actions to prevent re-creation
  const actions = useMemo(() => ({
    setSearch: (search) => dispatch({ type: 'SET_SEARCH', payload: search }),
    setCategory: (category) => dispatch({ type: 'SET_CATEGORY', payload: category }),
    setPriceRange: (range) => dispatch({ type: 'SET_PRICE_RANGE', payload: range }),
    setDateRange: (range) => dispatch({ type: 'SET_DATE_RANGE', payload: range }),
    setPage: (page) => dispatch({ type: 'SET_PAGE', payload: page }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
  }), []);

  // TOPIC: Hooks deep dive (useMemo) - Compute active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category !== 'all') count++;
    if (filters.priceRange !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    return count;
  }, [filters]);

  return {
    filters,
    actions,
    activeFilterCount,
  };
}
