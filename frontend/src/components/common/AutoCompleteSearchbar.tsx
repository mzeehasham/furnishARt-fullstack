import { Button } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { BiSearch } from 'react-icons/bi';
import { useState, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import FurnitureItemsSvs from '@/services/FurnitureItems';
import { AutoCompleteResponse } from '@/types/Types';
import { debounce } from 'lodash';

export default function AutoCompleteSearchbar({ selectedCategoryId }: { selectedCategoryId: number }) {
  const [options, setOptions] = useState<AutoCompleteResponse[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { mutate, isPending } = useMutation({mutationFn: FurnitureItemsSvs.fetchSuggestions});

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    console.log('Search button clicked!', inputValue);
    // Add your search logic here
  };

  const fetchSuggestions = (query: string) => {
    if (query.trim()) {
      mutate({searchTerm: query.trim(), category_id: selectedCategoryId}, {
        onSuccess: (data) => {
          setOptions((prevOptions) => {
            const newOptions = [...prevOptions];
            data.forEach((item) => {
              if (!newOptions.some(option => option.name === item.name)) {
                newOptions.push(item);
              }
            });
            return newOptions;
          });
        },
        onError: () => setOptions([]),
      });
    } else {
      setOptions([]);
    }
  };
  
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

  useEffect(() => {
    debouncedFetchSuggestions(inputValue);
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [inputValue]);

  return (
    <>
      <Autocomplete
        freeSolo
        sx={{
          width: 300,
          marginLeft: "0 !important",
          '&::placeholder': {
            opacity: 1,
            color: 'rgba(0, 0, 0, 0.6)',
          },
        }}
        className='!rounded-r-none'
        size='small'
        id="free-solo-2-demo"
        
        disableClearable
        options={options.length > 0 ? options.map((option) => option.name) : ["No Options"] }
        onInputChange={(event: ChangeEvent<{}>, value: string) => {
          setInputValue(value);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              '& label': {
                color: 'rgba(0, 0, 0, 0.6)',
              },
              '& label.Mui-focused': {
                color: 'rgba(0, 0, 0, 0.8)',
              },
            }}
            label="Search input"
            onKeyDown={handleKeyPress}
            InputProps={{
              ...params.InputProps,
              type: 'search',
              endAdornment: (
                <>
                  {isPending ? <span>Loading...</span> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <Button
        variant="contained"
        className='!m-0 !rounded-l-none'
        color="primary"
        sx={{ marginLeft: 0 }}
        size="small"
        onClick={handleSearch}
      >
        <BiSearch />
      </Button>
    </>
  );
}
