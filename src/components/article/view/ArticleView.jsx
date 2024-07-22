import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommentResisterForm from '../../comment/CommentResisterForm';
import { getArticleView, increaseLikeCount, decreaseLikeCount } from '../../../service/ArticleService';
import { getComment, getIsLike } from '../../../service/commentApi';
import CommentItem from '../../comment/CommentItem';
import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Menu, MenuItem, Modal, Typography, Box } from '@mui/material';
import { FavoriteOutlined } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArticleDelete from '../delete/ArticleDelete';
import ArticleReport from './ArticleReport';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import useToast from '../../../hooks/useToast';
import '../../../styles/article/articleView.css'
import { storageURL } from '../../../utils/single';

//모달창 css
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ArticleView = () => {
  const token = useSelector(state => state.MemberSlice).token;
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [articleDto, setArticleDto] = useState({});
  const [commentDto, setCommentDto] = useState([]);
  const [isLike, setIsLike] = useState(false);
  //자신의 글인지 확인
  const [verify, setVerify] = useState(false);
  const toast = useToast();
  const { articleTags, content, countLoves, countReview, created_who, memberImage, title, images, createdAt } = articleDto

  //댓글 등록시 리렌더링
  const [isArticleSubmitted, setIsArticleSubmitted] = useState(false);

  //등록 시간 포맷
  const [formattedDateTime, setFormattedDateTime] = useState('');

  const increaseLike = async () => {


    if ((token === undefined) || (token === null) || (token === '')) {

      toast("로그인 해 주세요")

    }
    else if (isLike) {

      await decreaseLikeCount(articleId);

      toast("좋아요가 취소되었습니다.")

      setIsArticleSubmitted(!isArticleSubmitted)
    }
    else {
      const body = {
        articleId: articleId
      }
      const response = await increaseLikeCount(body);

      toast(response)
      setIsArticleSubmitted(!isArticleSubmitted)
    }

  }


  //articleId 글 정보, 이미지 정보, 댓글 정보 받아오기
  useEffect(() => {

    const fetchData = async () => {

      const articleData = await getArticleView(articleId)

      const commentData = await getComment(articleId)




      setArticleDto(articleData);
      setCommentDto(commentData);

      const dateTime = new Date(
        articleData.createdAt
      );
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

      const result = await getIsLike(articleId)
      
      if (result !== null || result !== '') {

        setIsLike(result.isLike);

        if (result.memberNickname === articleData.created_who) {

          setVerify(true);
        }
      }
    }
    fetchData();

  }, [isArticleSubmitted])

  //수정 삭제 메뉴 handler
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //글 삭제 모달창 handler
  const [openModal, setOpenModal] = useState(false);
  const modalHandleOpen = () => {
    setOpenModal(!openModal)
  };
  const modalHandleClose = () => {

    setOpenModal(false);
  }
  // 신고 모달창 handler
  const [openReport, setOpenReport] = useState(false);
  const reportHandleOpen = () => {
    setOpenReport(!openReport)
  };
  const reportHandleClose = () => {

    setOpenReport(false);
  }



  const handleBack = () => {
    navigate(-1,
      { replace: true }
    );
  }


  // 태그 
  const formattedString = articleTags && articleTags.split(',')
    .map(item => `#${item}`)
    .join(' ');


  return (
    <>

      <Card sx={{ maxWidth: 630, border: 'none', margin: '20px auto' }}>
        <IconButton aria-label="history back" sx={{ marginLeft: '20px', marginTop: '20px', display: 'flex', fontSize: '15pt' }} onClick={handleBack}>
          <ArrowBackIcon />
          뒤로
        </IconButton>
        <CardHeader
          avatar={
            <Avatar alt={created_who} src={`${storageURL}/member/Profile/${memberImage}`} />
          }
          action={
            token === '' ? null :
              <IconButton aria-label="basic-menu" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
          }
          title={created_who}
          subheader={formattedDateTime}
          sx={{ textAlign: 'left', margin: '10px 20px' }}
        />

        <CardContent >
          <Typography variant="body2" color="text.secondary" fontSize="16pt" textAlign='left' sx={{ textAlign: 'center' }}>
            {title}
          </Typography>
        </CardContent>

        <CardContent>
          {/* <Typography 
            variant="body2" 
            color="text.secondary" 
            fontSize='15pt' 
            textAlign='left'  
            sx={{ margin: '0 20px', whiteSpace: 'pre-line' }}
            dangerouslySetInnerHTML={{ __html: content }}
          /> */}
          <ReactQuill
            value={content}
            readOnly={true}
            theme="snow"
            modules={{ toolbar: false }}
            style={{
              height: 'auto', backgroundColor: 'white', display: 'inline-block',
              width: '96%', marginTop: '1%', padding: '10px', marginBottom: '40px', whiteSpace: 'pre-wrap',
              textAlign: 'left'

            }}

          />
        </CardContent>
        {
          images && images.map((item, index) => <CardMedia
            key={index}
            component="img"
            width="100%"
            height="100%"
            image={`${storageURL}/article/img/${item.imgUrl}`}
            alt={index}
            sx={{ width: '50%', margin: '10px auto', border: '1px solid rgba(0,0,0,0.3)', borderRadius: '20px', padding: '2px' }}
          />)
        }
        <CardContent style={{ textAlign: 'left', marginLeft: '20px' }}>
          {formattedString}
        </CardContent>
        <CardActions disableSpacing sx={{ marginLeft: '20px', marginBottom: '20px' }}>
          <IconButton aria-label="add to favorites" onClick={increaseLike}>
            <FavoriteOutlined sx={{ color: isLike ? 'red' : 'black' }} />

          </IconButton>
          {countLoves}
        </CardActions>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          disableScrollLock
          MenuListProps={{
            'aria-labelledby': 'basic-button',

          }}
        >
          <MenuItem onClick={reportHandleOpen}>신고하기</MenuItem>

          {
            verify &&
            <>
              <MenuItem onClick={() => navigate(`/article/update/${articleId}`)}>수정하기</MenuItem>
              <MenuItem onClick={modalHandleOpen}>삭제하기</MenuItem>
            </>
          }

        </Menu>
      </Card >


      <Card sx={{ maxWidth: 630, border: 'none', margin: '20px auto' }}>
        <div style={{ marginBottom: '10px', padding: '10px', textAlign: 'left' }}>&emsp; 댓글 {countReview}</div>
        {
          commentDto && commentDto.map((item) =>

            <CommentItem key={item.articleCommentId} item={item} articleId={articleId} setIsArticleSubmitted={setIsArticleSubmitted} isArticleSubmitted={isArticleSubmitted} />
          )
        }
      </Card>
      {/* 모달창 삭제 */}
      <Modal
        open={openModal}
        onClose={modalHandleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>

          <div style={{ textAlign: 'center' }}>
            <ArticleDelete articleId={articleId} modalHandleClose={modalHandleClose} />
          </div>
        </Box>
      </Modal>

      {/* 모달 창 신고 */}
      <Modal
        open={openReport}
        onClose={reportHandleClose}
        aria-labelledby="modal-modal-report"
        aria-describedby="modal-modal-reportdescription"
      >
        <Box sx={style}>

          <div style={{ textAlign: 'center' }}>
            <ArticleReport articleId={articleId} reportedId={created_who} reportHandleClose={reportHandleClose} />
          </div>
        </Box>
      </Modal>

      <footer style={{ marginBottom: '50px' }}>

        <CommentResisterForm memberNickname={created_who} commentRef={0} articleId={articleId} parentId={0} setIsArticleSubmitted={setIsArticleSubmitted} isArticleSubmitted={isArticleSubmitted} />

      </footer>
    </>
  );
};

export default ArticleView;