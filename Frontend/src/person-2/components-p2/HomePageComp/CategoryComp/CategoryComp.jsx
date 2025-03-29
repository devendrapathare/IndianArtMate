import React from 'react'
import './CategoryComp.css'
import { like_dislike_images } from '../../../../assets/assets';


const CategoryComp = ({ post, userNames, url, renderStars, handleLikeDislike, GotoPost }) => {

    return (
        <div>
            <div
                className="card"
                key={post._id}
            >
                <img
                    id='main-card-img'
                    src={`${url}/images/${post.image}`}
                    alt={post.title}
                    onClick={() =>
                        GotoPost(post.image, post.category, post.description, post.price, post.title, post.userId, post._id)
                    }
                />
                <div className="card-bottom">
                    <div className="card-bottom-left">
                        <div className="arties-name">
                            <p>Made by: <span><b><u>{userNames[post._id] || 'Loading...'}</u></b></span></p>
                        </div>
                        <div className="arties-rating">
                            <p>Rating: {renderStars((post.commentRank + post.likeDislikeRank) / 2)}</p>
                        </div>

                    </div>

                    <div className="card-bottom-right">
                        <div className="like-dislike">
                            <div className="like imgs">
                                <img
                                    className='respons'
                                    src={like_dislike_images.like}
                                    alt="Like"
                                    onClick={() => handleLikeDislike(post._id, 'like')}
                                />
                                <p>{post.like?.length}</p>
                            </div>
                            <div className="dislike imgs">
                                <img
                                    className='respons'
                                    src={like_dislike_images.dislike}
                                    alt="Dislike"
                                    onClick={() => handleLikeDislike(post._id, 'dislike')}
                                />
                                <p>{post.disLike?.length}</p>
                            </div>
                        </div>
                        <div className="card-bottom-price">
                            <p>Price: <span><b><u>₹{post.price}</u></b></span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryComp