import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  Modal,
  Typography
} from '@mui/material';
import { usePagination, useTable } from 'react-table';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/QueryResults.css';
import { AccordionStyle, ages, corpuses, educations, genders, locations, textTypes } from '../../utils/constants';
import TablePagination from '../../components/table/TablePagination';
import QueryDownloadButton from './QueryDownloadButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { queryStore } from '../../store/QueryStore';
import { loadFetch } from '../../service/LoadFetch';

function QueryResults(props) {

  const response = props.data;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAccordionExpanded, setModalAccordionExpanded] = useState(false);
  const [resultAccordionExpanded, setResultAccordionExpanded] = useState(false);
  const [text, setText] = useState('');
  const [isLoadingSelectAllTexts, setIsLoadingSelectAllTexts] = useState(false);
  const checkboxStatuses = useRef(new Set());
  const [update, forceUpdate] = useReducer(x => x + 1, 0);

  let paragraphCount = 0;

  const [metadata, setMetadata] = useState({
    title: '',
    korpus: '',
    tekstityyp: '',
    tekstikeel: '',
    keeletase: '',
    abivahendid: '',
    aasta: '',
    vanus: '',
    sugu: '',
    haridus: '',
    emakeel: '',
    elukohariik: ''
  });

  const basicMetadataFields = ['title', 'tekstikeel', 'keeletase', 'abivahendid', 'aasta', 'emakeel'];

  const columns = useMemo(() => [
      {
        Header: '',
        accessor: 'text_id',
        Cell: (cellProps) => {
          return <Checkbox checked={checkboxStatuses.current.has(cellProps.value)}
                           id={cellProps.value}
                           onChange={() => alterCheckbox(cellProps.value)}/>;
        },
        className: 'checkboxRow'
      },
      {
        Header: '',
        accessor: 'property_value',
        Cell: (cellProps) => {
          return <span className="clickableRow"
                       onClick={() => previewText(cellProps.row.original.text_id)}>{cellProps.value}</span>;
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const data = useMemo(() => response, [response]);
  const allTextIds = data.map(item => {
    return item.text_id;
  });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {pageIndex, pageSize}
  } =
    useTable({columns, data}, usePagination);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60vw',
    bgcolor: '#FCFCFC',
    boxShadow: 24,
    borderRadius: '12px',
    p: 4,
    maxHeight: '80vh',
    overflow: 'auto'
  };

  const changeModalAccordion = () => {
    setModalAccordionExpanded(!modalAccordionExpanded);
  };

  const changeResultAccordion = () => {
    setResultAccordionExpanded(!resultAccordionExpanded);
  };

  const alterCheckbox = (id) => {
    if (checkboxStatuses.current.has(id)) {
      checkboxStatuses.current.delete(id);
    } else {
      checkboxStatuses.current.add(id);
    }
    forceUpdate();
  };

  function previewText(id) {
    loadFetch('/api/texts/kysitekstimetainfo?id=' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then((result) => {
        result.forEach(param => {
          if (basicMetadataFields.includes(param.property_name)) {
            setIndividualMetadata(param.property_name, param.property_value);
          }
          if (param.property_name === 'korpus') {
            setIndividualMetadata('korpus', corpuses[param.property_value]);
          }
          if (param.property_name === 'tekstityyp') {
            if (textTypes[param.property_value] !== undefined) {
              setIndividualMetadata('tekstityyp', textTypes[param.property_value]);
            }
          }
          if (param.property_name === 'vanus') {
            if (ages[param.property_value] !== undefined) {
              setIndividualMetadata('vanus', ages[param.property_value]);
            } else {
              if (param.property_value <= 18) {
                setIndividualMetadata('vanus', ages['kuni18']);
              } else if (param.property_value > 18 && param.property_value < 27) {
                setIndividualMetadata('vanus', ages['kuni26']);
              } else if (param.property_value > 26 && param.property_value < 41) {
                setIndividualMetadata('vanus', ages['kuni40']);
              } else if (param.property_value > 40) {
                setIndividualMetadata('vanus', ages['41plus']);
              }
            }
          }
          if (param.property_name === 'sugu') {
            setIndividualMetadata('sugu', genders[param.property_value]);
          }
          if (param.property_name === 'haridus') {
            setIndividualMetadata('haridus', educations[param.property_value]);
          }
          if (param.property_name === 'elukoht') {
            if ('riik' in result) {
              const countryPropertyValue = result['riik'].property_value;
              const startingLetter = countryPropertyValue.charAt(0).toUpperCase();
              setIndividualMetadata('elukohariik', startingLetter + countryPropertyValue.slice(1));
            } else {
              if (locations.includes(param.property_value)) {
                setIndividualMetadata('elukohariik', 'Eesti');
              } else {
                const startingLetter = param.property_value.charAt(0).toUpperCase();
                setIndividualMetadata('elukohariik', startingLetter + param.property_value.slice(1));
              }
            }
          }
        });
      });
    loadFetch('/api/texts/kysitekst?id=' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.text())
      .then((result) => {
        setText(result);
      });

    Object.entries(metadata).forEach((entry) => {
      if (entry[1] === '') {
        setIndividualMetadata(entry[0], '-');
      }
    });

    setModalOpen(true);
  }

  const setIndividualMetadata = (keyName, valueName) => {
    setMetadata(prevData => {
      return {
        ...prevData,
        [keyName]: valueName
      };
    });
  };

  useEffect(() => {
    setIsLoadingSelectAllTexts(false);
  }, [update]);

  useEffect(() => {
    if (isLoadingSelectAllTexts) {
      if (allTextsSelected()) {
        checkboxStatuses.current.clear();
      } else {
        checkboxStatuses.current.clear();
        allTextIds.forEach(item => {
          checkboxStatuses.current.add(item);
        });
      }
      forceUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingSelectAllTexts]);

  useEffect(() => {
    setResultAccordionExpanded(response.length > 0);
  }, [response]);

  function allTextsSelected() {
    return allTextIds.every(v => Array.from(checkboxStatuses.current).includes(v));
  }

  const saveTexts = () => {
    queryStore.dispatch({
      type: 'CHANGE_CORPUS_TEXTS',
      value: Array.from(checkboxStatuses.current).join(',')
    });
    setResultAccordionExpanded(false);
  };

  const getParagraphKey = (item) => {
    if (item) {
      return item;
    } else {
      paragraphCount++;
      return `empty_paragraph_${paragraphCount}`;
    }
  };

  return (
    <Accordion sx={AccordionStyle}
               expanded={resultAccordionExpanded}
               className={`accordionBorder ${resultAccordionExpanded && 'openedResultsAccordion'}`}
               disabled={response.length < 1}
               onChange={changeResultAccordion}>
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}
                        id="results-header">
        <Typography>
          Otsingu tulemused
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {response.length > 0 ? <h4><strong>Leitud tekste:</strong> {response.length}</h4> : <></>}
        {response.length > 0 &&
          <>
            <LoadingButton variant="outlined"
                           loadingIndicator={<CircularProgress disableShrink
                                                               color="inherit"
                                                               size={16}/>}
                           loading={isLoadingSelectAllTexts}
                           disabled={isLoadingSelectAllTexts}
                           className="selectAllButton"
                           onClick={() => setIsLoadingSelectAllTexts(true)}>
              {allTextsSelected() ? 'Eemalda kõik' : 'Vali kõik'}
            </LoadingButton>
            <Button variant="contained"
                    disabled={checkboxStatuses.current.size === 0}
                    onClick={saveTexts}
                    className="saveTextsButton">Salvesta tekstid analüüsiks</Button>
            <QueryDownloadButton selected={checkboxStatuses.current}/>
            <table className="resultTable"
                   {...getTableProps()}>
              <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
              </thead>
              <tbody {...getTableBodyProps()}>
              {page.map((row, _i) => {
                prepareRow(row);
                return (
                  <tr
                    className="tableRow border"
                    {...row.getRowProps()}
                    key={row.values.text_id}
                    id={row.values.text_id}>
                    {row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps({
                          className: cell.column.className
                        })}>
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              </tbody>
            </table>
            <br/>
            <TablePagination
              gotoPage={gotoPage}
              previousPage={previousPage}
              canPreviousPage={canPreviousPage}
              nextPage={nextPage}
              canNextPage={canNextPage}
              pageIndex={pageIndex}
              pageOptions={pageOptions}
              pageSize={pageSize}
              setPageSize={setPageSize}
              pageCount={pageCount}
            />
          </>
        }

        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
        >
          <Box sx={modalStyle}>
            <div className="modal-head">
              {metadata.title}
            </div>
            <IconButton
              aria-label="close"
              onClick={() => {
                setModalOpen(false);
              }}
              className="closeButton"
            >
              <CloseIcon/>
            </IconButton>
            <br/>
            <div>
              <Accordion expanded={modalAccordionExpanded}
                         onChange={changeModalAccordion}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon/>}
                  id="filters-header"
                >
                  <Typography>
                    Teksti metainfo
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="metainfoSubtitle">Teksti andmed</div>
                  <strong>Alamkorpus:</strong> {metadata.korpus}<br/>
                  <strong>Liik:</strong> {metadata.tekstityyp}<br/>
                  <strong>Keel:</strong> {metadata.tekstikeel}<br/>
                  <strong>Tase:</strong> {metadata.keeletase}<br/>
                  <strong>Kasutatud õppematerjale:</strong> {metadata.abivahendid}<br/>
                  <strong>Lisamise aasta:</strong> {metadata.aasta}<br/>
                  <br/>
                  <div className="metainfoSubtitle">Autori andmed</div>
                  <strong>Vanus:</strong> {metadata.vanus}<br/>
                  <strong>Sugu:</strong> {metadata.sugu}<br/>
                  <strong>Haridus:</strong> {metadata.haridus}<br/>
                  <strong>Emakeel:</strong> {metadata.emakeel}<br/>
                  <strong>Elukohariik:</strong> {metadata.elukohariik}<br/>
                </AccordionDetails>
              </Accordion>
              <br/>
              {text.split(/\\n/g).map(function (item) {
                return (
                  <span key={getParagraphKey(item)}>
                    {item}
                    <br/>
                  </span>
                );
              })}
            </div>
          </Box>
        </Modal>
      </AccordionDetails>
    </Accordion>
  );
}

export default QueryResults;