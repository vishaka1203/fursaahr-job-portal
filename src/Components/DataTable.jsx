import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

function DataTable({ columns, rows, title, button, onButtonClick }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          padding: '10px 15px', // Reduced padding around title and button
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h6" // Changed to a smaller font size for a more compact appearance
          component="div"
          sx={{ fontWeight: 'bold' }}
        >
          {title}
        </Typography>
        {button && (
          <Button
            variant="contained"
            color="primary"
            onClick={onButtonClick}
            size="small" // Reduced button size for a more compact look
          >
            {button.text}
          </Button>
        )}
      </Box>
      <Divider />
      <TableContainer sx={{ maxHeight: 280 }}>
        {' '}
        {/* Reduced maxHeight for a smaller table */}
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{
                    minWidth: column.minWidth,
                    padding: '6px 10px', // Reduced padding inside table cells
                    fontSize: '0.875rem', // Slightly smaller font size for compactness
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{ padding: '6px 10px' }} // Reduced padding inside table cells
                    >
                      {row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          padding: '8px 16px', // Reduced padding in pagination
          fontSize: '0.875rem', // Smaller font for a more compact look
        }}
      />
    </Paper>
  );
}

export default DataTable;
