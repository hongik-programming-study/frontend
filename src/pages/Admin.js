import React, { useEffect, useState } from "react";
import GlobalStyle from "../styles/Globalstyle";
import { Container } from "../styles/theme";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { addBanner } from "../redux/slices/adminSlice";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { sampleBanner } from "../components/Banner";
import { deleteBanner, getBanner } from "../redux/slices/mainSlice";
import { API_URL } from "../config";

const AdminContainer = styled(Container)`
  & .sec-tit {
    font-size: 2.8rem;
    text-align: center;
    margin-bottom: 3rem;
    font-weight: 500;
  }
`;

const ImgInput = styled.input`
  position: relative;
  bottom: -0.5rem;
  left: 0rem;
`;

const Slice = styled.div`
  width: 100%;
  background: rgb(140, 131, 255);
  background: linear-gradient(
    45deg,
    rgba(140, 131, 255, 1) 0%,
    rgba(50, 169, 140, 1) 100%
  );
  border-radius: 7px;
  padding: 2rem;
`;
const Setting = styled.div`
  display: flex;
  flex-direction: row;

  & button {
    background: none;
    outline: none;
    border: 2px solid rgba(255, 255, 255, 0.9);
    border-radius: 5px;
    margin: 1rem;
    color: rgba(255, 255, 255, 0.9);
    font-size: 2rem;
    padding: 1.3rem;
    cursor: pointer;
    &:hover {
      border: 2px solid rgba(255, 255, 255, 0.7);
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

const BannerArea = styled.div`
  width: 100%;
  background: white;
  border-radius: 7px;
  padding: 1.5rem;
  display: block;
  margin: 1rem;
  & .BannerSetting {
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 100%;
    & .img-box {
      width: 360px;
      height: 200px;
      overflow: hidden;
      border-radius: 7px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      img {
        width: 100%;
        object-fit: cover;
      }
    }
  }
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1.5rem;
  position: relative;
  top: -1rem;

  input {
    padding: 5px 7px;
    outline: none;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  textarea {
    padding: 2px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  & .title {
    //color: #ffc90a;
    font-size: 2rem;
    font-weight: 500;
  }

  & .explain {
    //color: white;
    font-size: 1.4rem;
    margin: 1.6rem 0;
    margin-bottom: 3rem;
  }

  & .explain-input {
    font-size: 1.4rem;
    margin: 1.6rem 0;
    margin-bottom: 3rem;
    resize: none;
    height: 5rem;
    padding: 5px 7px;
  }

  & .author {
    margin-top: 1rem;
    font-size: 1.4rem;
    color: #808080;
    display: flex;
    justify-content: right;
  }
  & .tags-input {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: row;

    div {
      color: white;
      background: #ccc;
      font-size: 1.3rem;
      padding: 0.3rem 1rem;
      margin-right: 1rem;

      border-radius: 7px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  & .tags {
    display: flex;
    flex-direction: row;

    div {
      color: white;
      background: #ccc;
      font-size: 1.3rem;
      padding: 0.3rem 1rem;
      margin-left: 1rem;
      border-radius: 7px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
`;

const Admin = () => {
  const dispatch = useDispatch();
  const status = useSelector(state => state.admin.status);
  const banners = useSelector(state => state.main.banners);

  const [title, setTitle] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  const [currentTag, setCurrentTag] = useState("");

  const onTagPush = () => {
    if (!tags.includes(currentTag)) setTags([...tags, currentTag]);
    setCurrentTag("");
  };

  console.log(title, tags, content, url, imgUrl);

  const onAddBanner = async e => {
    e.preventDefault();

    const data = {
      title: title,
      nickname: "관리자",
      url: url,
      imgUrl: imgUrl,
      content: content,
      tags: tags,
    };

    dispatch(addBanner(data));
  };

  const onImageChage = async e => {
    const img = e.target.files[0];
    const formData = new FormData();
    formData.append("image", img);

    const response = await axiosInstance.post(
      `${API_URL}/v1/file/upload`,
      formData,
      { header: { "content-type": "multipart/formdata" } },
    );

    const url = `${API_URL}${response.data.data.imageURL}`;
    setImgUrl(url);
  };

  const onRemoveBanner = async bannerId => {
    await dispatch(deleteBanner(bannerId));
  };

  useEffect(() => {
    dispatch(getBanner());
  }, []);

  return (
    <AdminContainer>
      <GlobalStyle />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div className="sec-tit">관리자 페이지</div>

        <Slice>
          {banners.map(banner => (
            <Setting key={banner.bannerId}>
              <BannerArea href={banner.url}>
                <div className="BannerSetting">
                  <div className="img-box">
                    <img src={banner.imgUrl} />
                  </div>
                  <Content>
                    <div className="title">{banner.title}</div>
                    <div className="explain">{banner.content}</div>
                    <div className="tags">
                      {banner.tags?.map(tag => (
                        <div>{tag.name}</div>
                      ))}
                    </div>
                    <div className="author">자몽</div>
                  </Content>
                </div>
              </BannerArea>
              <button
                onClick={() => {
                  onRemoveBanner(banner.bannerId);
                }}
              >
                -
              </button>
            </Setting>
          ))}
          <Setting>
            <BannerArea>
              <div className="BannerSetting">
                <div>
                  <img className="img-box" src={imgUrl} alt="썸네일 이미지" />
                  <ImgInput
                    type="file"
                    accept="image/jpg,image/png,image/jpeg,image/gif"
                    name="profile_img"
                    onChange={onImageChage}
                  />
                </div>
                <Content>
                  <input
                    className="title"
                    placeholder="title"
                    type="text"
                    name="title"
                    onChange={e => setTitle(e.target.value)}
                  />

                  <textarea
                    className="explain-input"
                    placeholder="content"
                    type="text"
                    name="content"
                    onChange={e => setContent(e.target.value)}
                  />
                  <div className="tags-input">
                    {tags.map((tag, id) => (
                      <div
                        onClick={() => {
                          setTags(tags.filter(t => t !== tag));
                        }}
                      >
                        {tag}
                      </div>
                    ))}
                    <input
                      placeholder="tags"
                      onChange={e => setCurrentTag(e.target.value)}
                      value={currentTag}
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          onTagPush();
                        }
                      }}
                    />
                  </div>

                  <input
                    placeholder="url"
                    type="text"
                    name="url"
                    onChange={e => setUrl(e.target.value)}
                  />
                </Content>
              </div>
            </BannerArea>
            <button onClick={onAddBanner}>+</button>
          </Setting>
        </Slice>
      </div>
    </AdminContainer>
  );
};

export default Admin;
