import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { withRouter } from "react-router";

import { Form, Field } from 'react-final-form';
import { TextField, Checkbox } from 'final-form-material-ui';
import createDecorator from 'final-form-focus';

import { makeStyles } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SearchIcon from '@material-ui/icons/Search';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { ACTION_CSR_SEARCH } from '../../stores/actions/csr-search-actions';
import { ACTION_CSR_SETTINGS_DRAWER_CLOSE } from '../../stores/actions/csr-settings-actions';
import { composeValidators, mustBeNumber } from '../../validators';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  search: {
    '&.Mui-selected':{
      backgroundColor: theme.palette.secondary.main,
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
      },
      '& svg': {
        color: theme.palette.getContrastText(theme.palette.secondary.main),
      },
      '& span': {
        color: theme.palette.getContrastText(theme.palette.secondary.main),
      }
    }
  },
}));

const focusOnError = createDecorator()

/**
 * Search form rendered on side drawer used to lookup customers
 * 
 * @param {object} state [required] - Redux state
 * @param {object} dispatch [required] - Redux object that contains dispatch functions
 * @param {object} match [required] - React-Router match generated by parent component path regular expression that is used to determine page names
 * @param {object} history [required] - React-Router history used to update url
 */
const CsrSearchForm = ({state, dispatch, match, history}) => {
  const classes = useStyles();

  return (
  state.csr_settings_drawer_close
  ? 
    <ListItem button className={classes.search} selected={match.params.page_name === 'search'} onClick={(event) => {
      dispatch.csrSetDrawerClose(false);
      // if not at search then switch to search tab
      (match.params.page_name !== 'search') && history.push('/search')
    }}>
      <ListItemIcon><SearchIcon /></ListItemIcon>
      <ListItemText primary="Search"/>
    </ListItem>
  :
  <Form
    decorators={[focusOnError]}
    onSubmit={dispatch.csrSearch({
      csr_auth: state.csr_auth,
      page_size: state.csr_search_page_size,
      page_index: 0,
    })}
    render={({ handleSubmit, form, submitting, pristine, dirtyFields, dirtySinceLastSubmit, values }) => (
      <form onSubmit={handleSubmit} noValidate>
        <ListItem button type="submit" component="button" className={classes.search}
          selected={match.params.page_name === 'search'}
          onClick={(event) =>  // if not on search page then go to search page and prevent search dispatch action
            match.params.page_name !== 'search' && 
            (event.preventDefault() || history.push('/search'))
          }
        >
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary="Search"/>
        </ListItem>
        {match.params.page_name === 'search' && // tab is search or not yet set
        <React.Fragment>
        <Paper style={{ padding: 16 }} elevation={/* disable shadows */0}>
          <Grid container alignItems="flex-start" spacing={2}>
            <Grid item xs={12}>
              <h3>Contact</h3>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Field
                fullWidth
                name="first_name"
                component={TextField}
                variant="outlined"
                type="search"
                label="First Name"
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                fullWidth
                name="last_name"
                component={TextField}
                variant="outlined"
                type="search"
                label="Last Name"
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                fullWidth
                name="email"
                component={TextField}
                variant="outlined"
                type="search"
                label="Email"
              />
            </Grid>
            <Grid item xs={4}>
              <Field
                fullWidth
                name="area_code"
                component={TextField}
                variant="outlined"
                type="search"
                label="+Code"
              />
            </Grid>
            <Grid item xs={8}>
              <Field
                fullWidth
                name="phone_number"
                component={TextField}
                variant="outlined"
                type="search"
                label="Phone Number"
              />
            </Grid>
            <Grid item xs={12}>
              <em>Include leading 0 for international numbers.</em>
            </Grid>
            <Grid item xs={12}>
              <Field
                fullWidth
                name="company"
                component={TextField}
                variant="outlined"
                type="search"
                label="Company"
              />
            </Grid>
            <Grid item xs={12}>
              <h3>Account</h3>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Field
                fullWidth
                name="customer_id"
                component={TextField}
                variant="outlined"
                type="search"
                label="Account Number"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                label="This is a parent or child account"
                control={
                  <Field
                    name="parent_child_account"
                    component={Checkbox}
                    type="checkbox"
                  />
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                fullWidth
                name="username"
                component={TextField}
                variant="outlined"
                type="search"
                label="Login ID"
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                fullWidth
                name="account_type"
                component={TextField}
                variant="outlined"
                type="search"
                label="Account Type"
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                fullWidth
                name="status"
                select
                required
                variant="outlined"
                SelectProps={{
                  native: true,
                }}
                component={TextField}
                label="Account Status"
              >
                <option value=""></option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="CLOSED">Closed</option>
              </Field>
            </Grid>
            <Grid item xs={12}>
              <h3>Payment</h3>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Field
                fullWidth
                name="credit_card_last_4"
                component={TextField}
                variant="outlined"
                label="Credit Card (last 4 digits)"
                InputProps={{
                  inputProps:{
                    maxLength: 4,
                    type: 'search',
                  },
                }}
                validate={composeValidators(
                  mustBeNumber(),
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                fullWidth
                name="credit_card_first_6"
                component={TextField}
                variant="outlined"
                label="Credit Card (first 6 digits)"
                InputProps={{
                  inputProps:{
                    maxLength: 6,
                    type: 'search',
                  },
                }}
                validate={composeValidators(
                  mustBeNumber(),
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                fullWidth
                name="transaction_id"
                component={TextField}
                variant="outlined"
                type="search"
                label="Transaction ID"
              />
            </Grid>
            <Grid item xs={12}>
              <em>Cannot be combined with other search values</em>
            </Grid>
          </Grid>
        </Paper>
        <Divider />
        <ListItem button onClick={form.reset}>
          <ListItemIcon><HighlightOffIcon/></ListItemIcon>
          <ListItemText primary="Clear All" />
        </ListItem>
        </React.Fragment>
        }
      </form>
    )}
  />
  )
};
// type declaration and enforcement
CsrSearchForm.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  state: {
    ...state.csrAuthReducer,
    ...state.csrSearchReducer,
    ...state.csrSettingsReducer,
  }
});
const mapDispatchToProps = (dispatch) => ({
  dispatch: {
    csrSearch: ({csr_auth, page_size, page_index}) => (payload) => dispatch({
      type: ACTION_CSR_SEARCH,
      payload: {
        token: csr_auth.token,
        page_size: page_size,
        page_index: page_index,
        request: payload,
      }
    }),
    csrSetDrawerClose: (isClose) => dispatch({
      type: ACTION_CSR_SETTINGS_DRAWER_CLOSE,
      payload: isClose,
    }),
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CsrSearchForm))