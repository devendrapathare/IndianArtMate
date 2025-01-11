const MessageSkeleton = () => {
    return (
        <>
            <div className='message-skeleton__wrapper'>
                <div className='message-skeleton__avatar'></div>
                <div className='message-skeleton__text'>
                    <div className='message-skeleton__line message-skeleton__line--short'></div>
                    <div className='message-skeleton__line message-skeleton__line--short'></div>
                </div>
            </div>
            <div className='message-skeleton__wrapper message-skeleton__wrapper--reverse'>
                <div className='message-skeleton__text'>
                    <div className='message-skeleton__line message-skeleton__line--short'></div>
                </div>
                <div className='message-skeleton__avatar'></div>
            </div>
        </>
    );
};
export default MessageSkeleton;
