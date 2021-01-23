import isEqual from "lodash/isEqual";
import memoize from "lodash/memoize";
import { useEffect, useState, useCallback, useMemo , useHooks } from 'react';


export default function useApi(url, options = {}) {
  const [previousOptions, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  let unmounted = false;

  // Converts the URL and params to a string for use by the cache.
  const resolver = useCallback(
    (url, params) => `{"${url}": ${JSON.stringify(params)}}`,
    []
  );

  // The fetch function is what actually retrieves data from the server.
  // We call useMemo because it only needs to be created once, otherwise
  // the cache will always be empty. We memoize it so that repeated calls
  // to the same url/params will return the results from the last call.
  const memoFetch = useMemo(
    () =>
      memoize(
        (url, params) => fetch(url, params).then(res => res.json()),
        resolver
      ),
    []
  );

  // Remove the currently fetched page from the cache so that when it
  // refetches, it will hit the server again.
  const refetch = useCallback(
    () => {
      memoFetch.cache.delete(resolver(url, options));
      setOptions(null);
    },
    [url, options]
  );

  // Clear the whole cache so that every request will hit the server again.
  const invalidate = useCallback(() => {
    memoFetch.cache.clear();
    setOptions(null);
  }, []);

  useEffect(
    () => {
      if (isEqual(options, previousOptions)) return;

      async function fetchData() {
        if (unmounted) return;

        try {
          setLoading(true);
          const res = await memoFetch(url, options);
          if (unmounted) return;

          setResults(res);
          setError(null);
        } catch (err) {
          setError(err);
        }

        setLoading(false);
      }

      setOptions(options);
      fetchData();
    },
    [url, options]
  );

  // Caller can force invalidation by passing in an "invalidate" prop
  useEffect(
    () => {
      if (options.invalidate) {
        invalidate();
      }
    },
    [options.invalidate]
  );

  // Changing the URL triggers a full update
  useEffect(
    () => {
      setOptions(null);
    },
    [url]
  );

  // This is a bit of a hack since we don't expose a way to cancel the request
  useEffect(
    () => () => {
      unmounted = true;
    },
    []
  );

  return {
    loading,
    results,
    error,
    refetch,
    invalidate
  };
}
