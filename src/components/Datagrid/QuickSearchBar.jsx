import { Box } from "@mui/material";
import { GridToolbar, GridToolbarQuickFilter } from '@mui/x-data-grid';


const QuickSearchBar = () => {
    return (
        <Box
            sx={{
                p: 1,
                pt: 2,
                px: 2,
            }}
        >
            <GridToolbar />
            <GridToolbarQuickFilter
                quickFilterParser={(searchInput) =>
                    searchInput
                        .split(',')
                        .map((value) => value.trim())
                        .filter((value) => value !== '')
                }
                debounceMs={1000}
            />
        </Box>
    );
}

export default QuickSearchBar

