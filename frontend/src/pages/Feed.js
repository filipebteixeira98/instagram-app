import React, { Component } from 'react';

import api from '../services/api';

import './Feed.css';

import more from '../assets/more.svg';
import like from '../assets/like.svg';
import likeFilled from '../assets/like-filled.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';

class Feed extends Component {
  state = {
    feed: []
  };

  async componentDidMount() {
    const response = await api.get('/posts');

    this.setState({ feed: response.data });
  }

  async handleLikePost(postId) {
    let likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');

    const isLiked = likedPosts.includes(postId);

    if (isLiked) {
      likedPosts = likedPosts.filter(id => id !== postId);

      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

      this.setState(prevState => ({
        feed: prevState.feed.map(post =>
          post._id === postId ? { ...post, likes: post.likes - 1 } : post
        )
      }));
    } else {
      await api.post(`/posts/${postId}/like`);

      likedPosts.push(postId);

      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

      this.setState(prevState => ({
        feed: prevState.feed.map(post =>
          post._id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      }));
    }
  }

  isPostLiked(postId) {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');

    return likedPosts.includes(postId);
  }

  render() {
    return (
      <section id='post-list'>
        {this.state.feed.map(post => (
          <article key={post._id}>
            <header>
              <div className='user-info'>
                <span>{post.author}</span>
                <span className='place'>{post.place}</span>
              </div>
              <img src={more} alt='More' />
            </header>
            <img src={`http://localhost:3333/files/${post.image}`} alt='' />
            <footer>
              <div className='actions'>
                <span onClick={() => this.handleLikePost(post._id)}>
                  {this.isPostLiked(post._id) ? (
                    <img src={likeFilled} alt='Liked' />
                  ) : (
                    <img src={like} alt='Like' />
                  )}
                </span>
                <img src={comment} alt='' />
                <img src={send} alt='' />
              </div>
              <strong>{post.likes} like{post.likes > 1 ? 's' : ''}</strong>
              <p>
                {post.description}
                <span>{post.hashtags}</span>
              </p>
            </footer>
          </article>
        ))}
      </section>
    );
  }
}

export default Feed;