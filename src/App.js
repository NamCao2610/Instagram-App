import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth, googleAuthProvider, facebookAuthProvider } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input, Avatar } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from '@aarnila/react-instagram-embed';
import FlipMove from 'react-flip-move';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height: "300px",
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    height: 200,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //User da log in
        console.log(authUser);
        setUser(authUser);

      } else {
        // user da logout
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username])


  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
  }, [])

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => { return authUser.user.updateProfile({ displayName: username, photoURL: '/static/images/avatar/1.jpg' }) })
      .catch(err => alert(err.message));

    setOpen(false);
  }

  const signIn = (e) => {
    e.preventDefault();

    auth.signInWithEmailAndPassword(email, password).catch(err => alert(err.message));
    setOpenSignIn(false);
  }

  const signInByGoogle = (e) => {
    e.preventDefault();

    auth.signInWithPopup(googleAuthProvider).catch(err => alert(err.message));

    setOpenSignIn(false);
  }

  const signInByFacebook = (e) => {
    e.preventDefault();

    auth.signInWithPopup(facebookAuthProvider).catch(err => alert(err.message));

    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>Sign In</Button>
            <Button onClick={signInByGoogle}>Sign In By Google</Button>
            <Button onClick={signInByFacebook}>Sign In By Facebook</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram_logo" />
        {user?.displayName ? (
          <div className="app__headerRight">
            <Button onClick={() => auth.signOut()}>Logout</Button>
            <Avatar
              className="app__headerAvatar"
              alt={user.displayName}
              src={user.photoURL}
            />
          </div>
        ) : (
            <div className="app__loginHome">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          <FlipMove>
            {posts.map((post) => (
              <Post key={post.id} postId={post.id} user={user} imgUrl={post.imgUrl} username={post.username} caption={post.caption} avatar={post.avatar} />
            ))}
          </FlipMove>
        </div>

        <div className="app__postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/B_e5Y1bJv4q/'
            maxWidth={320}
            accessToken='861643924574661|2efece70460183b05215f8a4361170f1'
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>

      </div>


      { user?.displayName ? (<div className="app__upload"><ImageUpload username={user.displayName} avatar={user.photoURL} /></div>) : (<h3>🎸🔥 Moi ban dang nhap </h3>)}
    </div>
  );
}

export default App;
