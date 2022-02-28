import React from "react";
// import {Link,Redirect} from "react-router-dom";
import "./styles.css";
import EditableBlock from "./editableBlock";

import uid from "../utils/uid";
import { setCaretToEnd } from "../utils/caretHelpers";
const initialBlock = { id: uid(), html: "", tag: "p" };
var BACKEND_PORT = `${process.env.REACT_APP_BACKEND_PORT}`;

class EditablePage extends React.Component {
  constructor(props) {
    super(props);
    this.updateBlockHandler = this.updateBlockHandler.bind(this);
    this.updatePageOnServer = this.updatePageOnServer.bind(this);
    this.addBlockHandler = this.addBlockHandler.bind(this);
    this.deleteBlockHandler = this.deleteBlockHandler.bind(this);
    this.state = { blocks: [initialBlock],dataisLoaded:false,page : "all",id:"" };
    this.userId = sessionStorage.userId;
  }
  async componentDidMount(){
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const id = params.get('page_id');
    console.log(id);
    this.setState({
      id:id,
    })
    if(id==null)
    {
      const data = await fetch(`http://localhost:`+BACKEND_PORT+`/pages`,{
        method: "GET",
      }).then((res) => res.json());
      if(data.message==="Fetched pages successfully.")
      {
        this.setState({
          blocks:data.pages,
        })
      }
    }
    else
    {
      const data = await fetch(`http://localhost:`+BACKEND_PORT+`/pages/${id}`,{
        method: "GET",
      }).then((res) => res.json());
      this.setState({
        blocks:data.page.blocks,
        page:"single",
      })
    }
    console.log(this.state.blocks)
    this.setState({
      dataisLoaded:true,
    })
  }
  updatePageOnServer = async (blocks) => {
    console.log(blocks);
    try {
      await fetch(`http://localhost:`+BACKEND_PORT+`/pages/${this.state.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocks: blocks,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };
  updateBlockHandler(updatedBlock) {
    const blocks = this.state.blocks;
    const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const newUpdatedBlocks = [...blocks];
    newUpdatedBlocks[index] = {
      ...newUpdatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html
    };
    this.setState({ blocks: newUpdatedBlocks });
    console.log(newUpdatedBlocks);
    this.updatePageOnServer(newUpdatedBlocks);
  }

  addBlockHandler(currentBlock) {
    const k=this.state.blocks.length;
    const newBlock = { id: uid(), html: "", tag: "p",key:k };
    const blocks = this.state.blocks;
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    this.setState({ blocks: updatedBlocks }, () => {
      currentBlock.ref.nextElementSibling.focus();
    });
    this.updatePageOnServer(blocks);
  }

  deleteBlockHandler(currentBlock) {
    // Only delete the block, if there is a preceding one
    const previousBlock = currentBlock.ref.previousElementSibling;
    const isFirstBlockWithoutSibling = previousBlock.parentElement.nextSibling;
    if ((previousBlock && previousBlock.className==="Block") || isFirstBlockWithoutSibling!==null) {
      const blocks = this.state.blocks;
      const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      this.setState({ blocks: updatedBlocks }, () => {
        setCaretToEnd(previousBlock);
        previousBlock.focus();
        this.updateBlockHandler(previousBlock);
      });
    }
  }

  render() {
    const dataisLoaded = this.state.dataisLoaded;
    const page = this.state.page;
    async function createNewPage()
    {
      const id=uid();
      console.log(id);
      try {
        const data = await fetch(`http://localhost:`+BACKEND_PORT+`/pages/${id}`,{
          method: "GET",
        }).then((res) => res.json());
        console.log(data);
      } catch (err) {
        console.log(err);
      }
      var url="/notes?page_id="+id;
      window.location.href=url;
    }
    if(dataisLoaded===true)
    {
      if(page==="all")
      {
        return(
          <div>
            <div className="header">
              Dassi
            </div>
            <div className="Page">
            <h3>All-Pages</h3>
            {this.state.blocks.map((block, key) => {
              return (
                <div>
                  <a href={`?page_id=${block._id}`}><h4>{block.blocks[0].html}</h4></a>
                </div>
              );
            })}
            <button className="btn btn-primary btn-large btn-block button-properties" onClick={createNewPage}>
              Create new Page
            </button>
            </div>
          </div>
        )
      }
      else
      {
        return (
          <div>
          <div className="header">
            Dassi
          </div>
          <div className="Page">
            <h1 className="pageHeading">Welcome to Notes!!</h1>
            <h5 className="pageHeading">Type slash '/' for getting commands</h5>
            {this.state.blocks.map((block, key) => {
              return (
                <EditableBlock
                  key={key}
                  id={block._id}
                  tag={block.tag}
                  html={block.html}
                  updateBlock={this.updateBlockHandler}
                  addBlock={this.addBlockHandler}
                  deleteBlock={this.deleteBlockHandler}
                />
              );
            })}
          </div>
          </div>
        );
      }
    }
    else
    {
      return (
        <div>
          <h1>Wait for some time</h1>
        </div>
      )
    }
  }
}

export default EditablePage;