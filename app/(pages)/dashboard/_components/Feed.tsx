import React from 'react'
import PostInput from './PostInput'
import Posts from './Posts'

const Feed  = () => {
  return (
    <div className='flex flex-col gap-4'>
        <PostInput />
        <Posts />
    </div>
  )
}

export default Feed