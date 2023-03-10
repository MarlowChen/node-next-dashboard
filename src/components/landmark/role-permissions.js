import { forwardRef, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';



export const RolePermissions = (props) => {
  const {selected, setSelected} = props;
  const [treeNode, setTreeNode] = useState([
    {
      nodeId: 0,
      name: "MarlowTest",
      desc: "測試介紹",
      childNodes: [
      ]
    }
  ]);

  function getChildById(node, id) {
    let array = [];

    function getAllChild(nodes) {
      if (nodes === null) return [];
      array.push(nodes.id);
      if (Array.isArray(nodes.childNodes)) {
        nodes.childNodes.forEach(node => {
          array = [...array, ...getAllChild(node)];
          array = array.filter((v, i) => array.indexOf(v) === i);
        });
      }
      return array;
    }

    function getNodeById(nodes, id) {
      if (nodes.id === id) {
        return nodes;
      } else if (Array.isArray(nodes.childNodes)) {
        let result = null;
        nodes.childNodes.forEach(node => {
          if (!!getNodeById(node, id)) {
            result = getNodeById(node, id);
          }
        });
        return result;
      }

      return null;
    }

    return getAllChild(getNodeById(node, id));
  }

  function getOnChange(checked, nodes) {
    const allNode = getChildById(treeNode, nodes.id);
    let array = checked
      ? [...selected, ...allNode]
      : selected.filter(value => !allNode.includes(value));

    array = array.filter((v, i) => array.indexOf(v) === i);

    setSelected(array);
  }

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <FormControlLabel
          control={
            <Checkbox
              checked={selected.some(item => item === nodes.id)}
              onChange={event =>
                getOnChange(event.currentTarget.checked, nodes)
              }
              onClick={e => e.stopPropagation()}
            />
          }
          label={<>{nodes.name}</>}
          key={nodes.id}
        />
      }
    >
      {Array.isArray(nodes.childNodes)
        ? nodes.childNodes.map(node => renderTree(node))
        : null}
    </TreeItem>
  );

  useEffect(() => {
    console.log(props.treeNode)
    setTreeNode(props.treeNode)
  }, [props.treeNode])


  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Card>
        <CardHeader
          // subheader="The information can be edited"
          title="權限編輯"
        />
        <Divider />
        <CardContent>
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={[1]}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            {renderTree(treeNode)}
          </TreeView>

        </CardContent>
        {/* <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
          >
            Save details
          </Button>
        </Box> */}
      </Card>
    </form>
  );
};
