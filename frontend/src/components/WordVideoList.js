import React from 'react'
import { useSelector } from 'react-redux'
import { getWordContexts } from '../Redux/Context/selectors'
import getYoutubeVideoId from '../utils/getYoutubeVideoId'

function WordVideoList (props) {
  const sortedContexts = useSelector(getWordContexts(props.wordId))

  return (
    <div style={{
      height: '100%',
      width: 285,
      paddingTop: 30,
      marginRight: 30
    }}>
      {sortedContexts.map(({ id, title, url }) => {
        return (<div
          key={id}
          style={{
            marginRight: 15,
            cursor: 'pointer'
          }}
          onClick={() => props.onClickContext(id)}
        >
          <img src={`https://img.youtube.com/vi/${getYoutubeVideoId(url)}/0.jpg`}
            style={{
              borderRadius: 20,
              width: 270,
              height: 200
            }}
          />
          <div
            style={{
              width: 280,
              marginTop: 10,
              marginBottom: 20,
              fontWeight: 600
            }}
          >
            {title}
          </div>
        </div>)
      })}
    </div>
  )
}

export default WordVideoList
