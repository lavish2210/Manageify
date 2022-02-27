import React from "react";

import "./styles.css";
import EditableBlock from "./editableBlock";

import uid from "../utils/uid";
import { setCaretToEnd } from "../utils/caretHelpers";
const initialBlock = { id: uid(), html: "", tag: "p" };

class EditablePage extends React.Component {
  constructor(props) {
    super(props);
    this.updateBlockHandler = this.updateBlockHandler.bind(this);
    this.updatePageOnServer = this.updatePageOnServer.bind(this);
    this.addBlockHandler = this.addBlockHandler.bind(this);
    this.deleteBlockHandler = this.deleteBlockHandler.bind(this);
    this.state = { blocks: [initialBlock],dataisLoaded:false };
    this.userId = sessionStorage.userId;
  }
  async componentDidMount(){
    // Link to be changed
    const data = await fetch(`http://localhost:8080/pages/621a1fd95568fd4f584cca38`,{
      method: "POST",
      body: JSON.stringify({
        userId:this.userId,
      }),
    }).then((res) => res.json());
    if(data.message==="Fetched page successfully.")
    {
      this.setState({
        blocks : data.page.blocks,
      });
    }
    this.setState({
      dataisLoaded:true,
    })
  }
  updatePageOnServer = async (blocks) => {
    console.log(blocks);
    try {
      await fetch(`http://localhost:8080/pages/621a1fd95568fd4f584cca38`, {
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
    if(dataisLoaded===true)
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