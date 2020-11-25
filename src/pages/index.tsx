import React from "react"
import {useQuery,useMutation, gql} from '@apollo/client'
// import gql from 'graphql-tag'
//material
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Formik } from "formik";


const useStyles = makeStyles(theme => ({
  '@global': {
      body: {
          backgroundColor: theme.palette.common.white,
      },
  },
  paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
  },
  avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
  },
  form: {
      width: '100%',
      marginTop: theme.spacing(3),
  },
  submit: {
      margin: theme.spacing(3, 0, 2),
  },
}));

const GET_BOOKMARK =gql`
  {
    bookmarks{
      id
      url
      title
      description
    }
  }
`;
const ADD_BOOKMARK= gql`
  mutation addBookmark($url:String!, $description:String, $title:String!){
    addBookmark(url:$url, description:$description, title:$title){
      url
      title
      description
    }
  }
`;
const DELETE_BOOKMARK=  gql`
  mutation deleteBookmark($id:ID!){
    deleteBookmark(id:$id){
      url
      title
      description
    }
  }
`;
const IndexPage = () => {
  const classes = useStyles();
  const {loading,error,data,refetch}=useQuery(GET_BOOKMARK)
  const [addBookmark]=useMutation(ADD_BOOKMARK)
  const [deleteBookmark]=useMutation(DELETE_BOOKMARK)
  const handleDelete = (event)=>{
    deleteBookmark({
      variables:{id:event.currentTarget.value},
      refetchQueries:[{query:GET_BOOKMARK}]
    })
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
          <Typography component="h1" variant="h5">
              Bookmark App
          </Typography>
          <Formik
            onSubmit={(value, action)=>{
              addBookmark({variables:{
                url:value.url,
                title:value.title,
                description:value.description
              },
              refetchQueries:[{query:GET_BOOKMARK}]
            })
            action.resetForm({
              values:{
                url:"",
                title:"",
                description:""
              }
            })
            }}
            initialValues={{
              url:"",
              title:"",
              description:""
            }}
          >
          {fromik=>(
           <form className={classes.form} onSubmit={fromik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField 
                  autoComplete="url"
                  name="url"
                  variant="outlined"
                  fullWidth
                  id="url"
                  label="url"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} >
                <TextField 
                  autoComplete="title"
                  name="title"
                  variant="outlined"
                  fullWidth
                  id="title"
                  label="Title"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  name="description"
                  variant="outlined"
                  fullWidth
                  id="description"
                  label="Description of bookmark"
                  autoFocus
                />
              </Grid>
            </Grid>
            <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
              >
                Submit
            </Button>
          </form>)}
          </Formik>
      </div>
    </Container>
  )
}

export default IndexPage
