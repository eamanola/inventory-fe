import React, { useEffect, useState } from 'react';

import {
  Container, Paper,
  AppBar, Tabs, Tab,
  List, ListItem, ListItemText,
  Backdrop, CircularProgress,
  Grid,
} from '@material-ui/core';

import {
  green,
  yellow,
  red,
} from '@material-ui/core/colors';

import { Pagination } from '@material-ui/lab';

import categoryService from './services/category';

const App = () => {
  const [category, setCategory] = useState('gloves');
  const [list, setList] = useState([]);
  const [page, setPage] = useState({
    gloves: 0,
    facemasks: 0,
    beanies: 0,
  });
  const [loading, setLoading] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const handleCategoryChange = (e, newValue) => {
    setCategory(newValue);
  };

  const handlePageChange = (e, newValue) => {
    setPage({ ...page, [category]: newValue - 1 });
  };

  useEffect(async () => {
    setTimeout(() => { setLoading(true); });

    const data = await categoryService.getCategory(category);
    setList(data);
    setTimeout(() => { setLoading(false); }, 1);
  }, [category]);

  const availabilityColor = (availability) => {
    let color;

    switch (availability) {
      case 'INSTOCK':
        // eslint-disable-next-line prefer-destructuring
        color = green[400];
        break;
      case 'LESSTHAN10':
        // eslint-disable-next-line prefer-destructuring
        color = yellow[400];
        break;
      case 'OUTOFSTOCK':
        // eslint-disable-next-line prefer-destructuring
        color = red[400];
        break;
      default:
        color = 'inherit';
    }

    return color;
  };

  return (
    <>
      <Container maxWidth="sm">
        <Paper>
          <AppBar position="static">
            <Tabs value={category} onChange={handleCategoryChange}>
              <Tab value="gloves" label="Gloves" />
              <Tab value="facemasks" label="Facemasks" />
              <Tab value="beanies" label="Beanies" />
            </Tabs>
          </AppBar>
          <List>
            {list.slice(
              page[category] * ITEMS_PER_PAGE,
              (page[category] + 1) * ITEMS_PER_PAGE,
            ).map((item) => (
              <ListItem>
                <ListItemText
                  primary={item.name}
                  secondary={(
                    <>
                      <span
                        style={{ color: availabilityColor(item.availability) }}
                      >
                        {item.availability}
                      </span>
                      &nbsp;
                      from
                      &nbsp;
                      {item.manufacturer}
                    </>
                  )}
                />
              </ListItem>
            ))}
          </List>
          <Grid container justify="center" style={{ padding: '0.5em 0' }}>
            <Pagination
              count={
                Math.floor(list.length / ITEMS_PER_PAGE)
                + (list.length % ITEMS_PER_PAGE > 0 ? 1 : 0)
              }
              color="primary"
              page={page[category] + 1}
              onChange={handlePageChange}
            />
          </Grid>
        </Paper>
        <Backdrop open={loading} style={{ zIndex: 1 }}>
          <CircularProgress />
        </Backdrop>
      </Container>
    </>
  );
};

export default App;
