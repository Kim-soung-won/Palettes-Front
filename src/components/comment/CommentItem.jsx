import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import CommentResisterForm from './CommentResisterForm';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import { Menu, MenuItem } from '@mui/material';
import { set } from 'date-fns';
import { storageURL } from '../../utils/single';

export default function CommentItem({ item, articleId, setIsArticleSubmitted, isArticleSubmitted }) {

    const { articleCommentId, children, content, memberImage, memberNickname, createAt } = item
    
    const [formattedDateTime, setFormattedDateTime] = useState('');

    //대댓글 등록창 handler
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    //수정 삭제 메뉴 handler
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

  
    useEffect(() => {
        const dateTime = new Date(createAt);
        const nowTime = new Date();
  
        const beforeTime = nowTime - dateTime;
        if (beforeTime < 1000) {
            setFormattedDateTime('방금 전');
        }
        else if (beforeTime < 60000) {
            setFormattedDateTime((beforeTime / 1000).toFixed(0) + ' 초 전')
        }
        else if (beforeTime < 3600000) {
            setFormattedDateTime((beforeTime / 60000).toFixed(0) + ' 분 전')
        }
        else if (beforeTime < 86400000) {
            setFormattedDateTime((beforeTime / 3600000).toFixed(0) + ' 시간 전')
        }
        else {
            setFormattedDateTime(
                `${dateTime.getFullYear()}.${(dateTime.getMonth() + 1).toString().padStart(2, '0')}.${dateTime.getDate().toString().padStart(2, '0')}`
            )
        }
    }, [item])



    return (
        <>

            <Card sx={{ maxWidth: 620, margin: 'auto', borderBottom: '0.5px solid rgba(0,0,0, 0.12)', boxShadow: '0' }}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="memberImage" src={`${storageURL}/member/Profile/${memberImage}`} />
                    }
                    action={
                        <IconButton id="basic-button" aria-label="settings" onClick={handleClick} >
                            {/* <MoreVertIcon /> */}
                        </IconButton>
                    }
                    title={memberNickname}
                    subheader={formattedDateTime}

                    sx={{ textAlign: 'left' }}
                />
                <CardContent sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" marginLeft={2}>
                        {content}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>

                    <IconButton aria-label="comment" onClick={handleExpandClick}>
                        <InsertCommentIcon />
                    </IconButton>

                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <CommentResisterForm memberNickname={memberNickname} commentRef={articleCommentId} articleId={articleId} parentId={articleCommentId} setIsArticleSubmitted={setIsArticleSubmitted} isArticleSubmitted={isArticleSubmitted} handleExpandClick={handleExpandClick}/>
                    </CardContent>
                </Collapse>
                {/* <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    disableScrollLock
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',

                    }}
                >
                  
                    <MenuItem>삭제하기</MenuItem>

                </Menu> */}
            </Card>

            <div style={{ marginLeft: 20 }}>
                {
                    children && children.length > 0 &&
                    <div style={{ marginLeft: 20 }}>
                        {
                            children.map((childItem, index) => (
                                <CommentItem key={index} item={childItem} articleId={articleId} setIsArticleSubmitted={setIsArticleSubmitted} isArticleSubmitted={isArticleSubmitted} />
                            ))
                        }
                    </div>
                }
            </div>
        </>
    );
}