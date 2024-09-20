import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Modal,
  TextField,
} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import React, { useCallback, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { saveSvgAsPng } from 'save-svg-as-png';
import useSWR from 'swr';
import moment from 'moment';
// import { CopyIcon } from '@/assets/js/CopyIcon';

const statusColorMap = {
  active: 'success',
  paused: 'error',
  vacation: 'warning',
};

const InvoicePage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [activeData, setActiveData] = useState({});
  const [copied, setCopied] = useState(false);
  const [branchIndex, setBranchIndex] = useState(0);
  const [userName, setUserName] = useState('');

  const QRRef = useRef();

  let apiSite = '';
  let reqBody = {};

  if (params.get('userId') != null) {
    apiSite = 'get_all_invoices_by_userid.php';
    reqBody = { userid: params.get('userId') };
  } else if (params.get('branchId') != null) {
    apiSite = 'get_all_invoices_by_branchid.php';
    reqBody = { branchid: params.get('branchId') };
  } else {
    apiSite = 'get_all_invoices_by_branchid.php';
  }

  const pathname = process.env.baseUrl + 'invoice/';

  const columns = params.get('userId')
    ? [
        { name: 'RANDOM CODE', uid: 'randomid' },
        { name: 'INVOICE ID', uid: 'invoiceid' },
        { name: 'INVOICE DATE', uid: 'createdate' },
        { name: 'CUSTOMER NAME', uid: 'customername' },
        { name: 'TOTAL', uid: 'total' },
        { name: 'VIEW INVOICE', uid: 'viewInvoice' },
        { name: 'DOWNLOAD QR', uid: 'downloadQR' },
        { name: 'DELETE', uid: 'delete' },
      ]
    : [
        { name: 'RANDOM CODE', uid: 'randomid' },
        { name: 'INVOICE ID', uid: 'invoiceid' },
        { name: 'INVOICE DATE', uid: 'createdate' },
        { name: 'CUSTOMER NAME', uid: 'customername' },
        { name: 'TOTAL', uid: 'total' },
        { name: 'USER NAME', uid: 'username' },
        { name: 'VIEW INVOICE', uid: 'viewInvoice' },
        { name: 'DOWNLOAD QR', uid: 'downloadQR' },
        { name: 'DELETE', uid: 'delete' },
      ];

  const fetcher = async (args) => {
    if (params.get('userId') == null && params.get('branchId') == null) {
      const branchResp = await fetch('getbranches.php').then((res) =>
        res.json()
      );
      setBranches(branchResp.data);
      return await fetch(args.api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchid: branchResp.data[branchIndex].branchid,
        }),
      }).then((res) => res.json());
    } else {
      return await fetch(args.api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args.body),
      }).then((res) => res.json());
    }
  };

  const { data, error, mutate, isLoading } = useSWR(
    { api: apiSite, body: reqBody },
    fetcher
  );

  const downloadQR = () => {
    saveSvgAsPng(QRRef.current, 'qr.png', { scale: 10 });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 4000);
      })
      .catch((error) => {
        console.error('Failed to copy text to clipboard:', error);
      });
  };

  const deleteInvoice = async (e) => {
    e.preventDefault();
    const response = await fetch('deleteinvoice.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceid: activeData.invoiceid }),
    }).then((res) => res.json());

    if (response.success) {
      alert(response.message);
      mutate();
    } else {
      console.error(response.message);
    }
  };

  const renderCell = useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case 'viewInvoice':
          return (
            <IconButton
              color="primary"
              onClick={() =>
                navigate(
                  '../invoice?randomId=' + user.randomid + '&showDownload'
                )
              }
            >
              {/* <EyeIcon /> */}
            </IconButton>
          );
        case 'delete':
          return (
            <IconButton color="error" onClick={() => setActiveData(user)}>
              {/* <DeleteIcon /> */}
            </IconButton>
          );
        case 'downloadQR':
          return (
            <IconButton color="primary" onClick={() => setActiveData(user)}>
              {/* <QRIcon /> */}
            </IconButton>
          );
        case 'createdate':
          return moment(cellValue).format('DD/MM/YYYY');
        default:
          return cellValue;
      }
    },
    [navigate]
  );

  return (
    <div className="container">
      <div className="header">
        <Button onClick={() => navigate(-1)}>{/* <BackIcon /> */}Back</Button>
        <h2>Admin Dashboard</h2>
        <Button
          onClick={() => {
            /* authService.signOut(navigate) */
          }}
        >
          {/* <LogoutIcon /> */}
        </Button>
      </div>
      <h3>{userName} Invoice List</h3>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.uid}>{column.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>Loading...</TableCell>
              </TableRow>
            ) : (
              data?.data?.map((item) => (
                <TableRow key={item.invoiceid}>
                  {columns.map((column) => (
                    <TableCell key={column.uid}>
                      {renderCell(item, column.uid)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* QR Code Modal */}
      <Modal open={Boolean(activeData)} onClose={() => setActiveData({})}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <QRCode
            ref={QRRef}
            value={pathname + '?randomId=' + activeData.randomid}
          />
          <TextField
            value={pathname + '?randomId=' + activeData.randomid}
            readOnly
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() =>
                    copyToClipboard(
                      pathname + '?randomId=' + activeData.randomid
                    )
                  }
                >
                  {/* <CopyIcon /> */}
                </IconButton>
              ),
            }}
          />
          {copied && <span>Copied to clipboard!</span>}
          <Button onClick={downloadQR}>Download QR Code</Button>
          <Button color="error" onClick={deleteInvoice}>
            Delete Invoice
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default InvoicePage;
