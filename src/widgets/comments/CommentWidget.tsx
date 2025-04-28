import React from 'react'
import { Avatar, List, Typography, Button, Input } from 'antd'
import { intlFormatDistance } from 'date-fns'

import styles from './styles.css';


export interface CommentWidgetProps {
  data: {
    img: string,
    user: string,
    comment: string
    createdAt: string
  }[];
}

const { Title } = Typography;
const { TextArea } = Input;

const CommentWidget = ({ data }: CommentWidgetProps) => {
  const [comment, setComment] = React.useState("");
  const submit = function() {
    window.appsmith.triggerEvent("onSubmit", { callbackData: { comment } })
    setComment("")
  }
  return (<div className="app">
      <Title className="title" level={5}>Add Comments</Title>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.img} />}
              title={<span>{item.user}</span>}
              description={item.comment}
            />
            <div className="timestamp">{intlFormatDistance(item.createdAt ? new Date(item.createdAt) : new Date(), new Date())}</div>
          </List.Item>
        )}
      />
      <div className="footer">
        <TextArea
          maxLength={100}
          placeholder="Write your comment here..."
          style={{ height: 80, resize: 'none' }}
          value={comment}
          onChange={e => setComment(e.target.value)} />
        <Button block onClick={submit}>Submit</Button>
      </div>
    </div>
  );
};

(CommentWidget as any).styles = styles;

export default CommentWidget;

