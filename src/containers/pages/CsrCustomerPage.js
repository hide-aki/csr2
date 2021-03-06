import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import { Route, Switch } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import CsrAccountSubPage from '../subpages/CsrAccountSubPage'
import CsrDevicesSubPage from '../subpages/CsrDevicesSubPage'

import CsrPlansSubPage from '../subpages/CsrPlansSubPage';
import CsrChangePlansSubPage from '../subpages/CsrChangePlansSubPage';

import { ACTION_CSR_FETCH_CUSTOMER } from '../../stores/actions/csr-customer-actions';
import { ACTION_CSR_FETCH_DEVICES } from '../../stores/actions/csr-devices-actions';
import { ACTION_CSR_FETCH_NOTES } from '../../stores/actions/csr-notes-actions';

// passing theme to children useTheme
// https://stackoverflow.com/questions/56496201/how-to-use-usetheme-hook-from-material-ui

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: 'inherit',
    color: 'inherit',
  },
  cardContent: {
    // set no height if screen size is xs
    [theme.breakpoints.down('xs')]: {
      minHeight: 'inherit',
    },
    minHeight: '28em',
    wordBreak: 'break-all',
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

/**
 * Main customer page containing account, device, plans and billing subpages
 * 
 * @param {object} state [required] - Redux state
 * @param {object} dispatch [required] - Redux object that contains dispatch functions
 * @param {object} match [required] - React-Router match generated by parent component path regular expression that is used to determine customer_id
 */
function CsrCustomerPage({state, dispatch, match}) {
  const classes = useStyles();

  // fetch customer data needed for summary
  useEffect(() => {
    // if authenticated and not requesting and customer is empty or does not match specified customer-id
    if ( state.csr_auth
        && !state.csr_customer_requesting
        && (!state.csr_customer || String(state.csr_customer.customer_id) !== match.params.customer_id) )
    {
      // fetch customer data
      dispatch.csrFetchCustomer({
        token: state.csr_auth.token,
        customer_id: match.params.customer_id
      });
      dispatch.csrFetchDevices({
        token: state.csr_auth.token,
        customer_id: match.params.customer_id
      });
      dispatch.csrFetchNotes({
        token: state.csr_auth.token,
        customer_id: match.params.customer_id
      });
    }

    // disable lint dependency checks since we intentionally
    // want to run once per url change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.csr_auth, state.csr_customer_reload, match.params.customer_id]); // this should not be state.csr_customer or else infinite loop

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Switch>
              <Route path="/customer/:customer_id/account" component={CsrAccountSubPage} />
              <Route exact path="/customer/:customer_id/plans" component={CsrPlansSubPage} />
              <Route path="/customer/:customer_id/plans/change" component={CsrChangePlansSubPage} />
              <Route path="/customer/:customer_id/devices" component={CsrDevicesSubPage} />
              <Route exact path="/customer/:customer_id/billing" render={()=><div>Billing Content Here</div>} />
              <Route path="/customer/:customer_id/billing/starred" render={()=><div>Starred</div>} />
              <Route path="/customer/:customer_id/billing/access" render={()=><div>AccessAlarm</div>} />
            </Switch>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
// type declaration and enforcement
CsrCustomerPage.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  state: {
    ...state.csrAuthReducer,
    ...state.csrCustomerReducer,
    ...state.csrDevicesReducer,
    ...state.csrSettingsReducer,
  }
});

const mapDispatchToProps = (dispatch) => ({
  dispatch: {
    csrFetchCustomer: (payload) => dispatch({
      type: ACTION_CSR_FETCH_CUSTOMER,
      payload
    }),
    csrFetchDevices: (payload) => dispatch({
      type: ACTION_CSR_FETCH_DEVICES,
      payload
    }),
    csrFetchNotes: (payload) => dispatch({
      type: ACTION_CSR_FETCH_NOTES,
      payload
    }),
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(CsrCustomerPage))
