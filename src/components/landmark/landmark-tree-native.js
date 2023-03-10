

import styles from "./landmark-tree-native.module.css"
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { IconButton, Checkbox, List, ListItem, ListItemText, ListItemIcon, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';
import { SortableContainer, SortableElement, SortableHandle } from './react-sortable-hoc.umd';
import { arrayMoveImmutable } from 'array-move';
import DehazeIcon from '@mui/icons-material/Dehaze';


const DragHandle = SortableHandle(() => <DehazeIcon />);

const SortableItem = SortableElement(({ value, handleSelectOne, selectedLandmarkIds }) => {
  const router = useRouter();
  const handelEdit = (node) => {
    router.push({
      pathname: './landmarks/detail',
      query: { id: node.landmark.id }
    })
  }

  return <ListItem sx={{ background: "white", my: 1 }}
    secondaryAction={
      <ListItemIcon edge="end" sx={{ cursor: "pointer" }}>
        <DragHandle />
      </ListItemIcon>
    }

  >
    <Checkbox
      edge="start"
      onChange={(e) => handleSelectOne(e, value.landmark.id)}
      checked={selectedLandmarkIds.indexOf(value.landmark.id) !== -1}
      inputProps={{ 'aria-labelledby': value.id }}
    />
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <ListItemText primary={value.landmark.name} />
      <IconButton onClick={() => handelEdit(value)}>
        <EditIcon />
      </IconButton>
    </Box>

  </ListItem>
});

const SortableList = SortableContainer(({ items, handleSelectOne, selectedLandmarkIds }) => {
  return (
    <List>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`}
          index={index}
          value={value}
          handleSelectOne={handleSelectOne}
          selectedLandmarkIds={selectedLandmarkIds}
        />
      ))}
    </List>
  );
});


export const LandmarkTreeNative = ({ parentId, landmarks, setLandmarks, selectedLandmarkIds, setSelectedLandmarkIds, updateIndex, ...rest }) => {

  //待儲存資料，如果有異動會更新
  const [saveObj, setSaveObj] = useState([]);

  const [loaded, setLoaded] = useState(false);




  const handleSelectAll = (event) => {
    let newSelectedLandmarkIds;
    if (selectedLandmarkIds <= 0) {
      newSelectedLandmarkIds = landmarks.map((landmark) => landmark.id);
    } else {
      newSelectedLandmarkIds = [];
    }

    setSelectedLandmarkIds(newSelectedLandmarkIds);
  };

  const handleSelectOne = (event, id) => {

    const selectedIndex = selectedLandmarkIds.indexOf(id);
    let newSelectedLandmarkIds = [];

    if (selectedIndex === -1) {
      newSelectedLandmarkIds = newSelectedLandmarkIds.concat(selectedLandmarkIds, id);
    } else if (selectedIndex === 0) {
      newSelectedLandmarkIds = newSelectedLandmarkIds.concat(selectedLandmarkIds.slice(1));
    } else if (selectedIndex === selectedLandmarkIds.length - 1) {
      newSelectedLandmarkIds = newSelectedLandmarkIds.concat(selectedLandmarkIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedLandmarkIds = newSelectedLandmarkIds.concat(
        selectedLandmarkIds.slice(0, selectedIndex),
        selectedLandmarkIds.slice(selectedIndex + 1)
      );
    }

    setSelectedLandmarkIds(newSelectedLandmarkIds);
  };


  const handelAddChild = (node) => {

    router.push({
      pathname: './landmarks/new',
      query: { parentId: node.landmark.id },
    },
      undefined,
      {
        shallow: true,
      },)
  }



  const handleChangeTreeSort = async (data) => {
    //console.log(data.treeData)
    const datas = await convertTree([], data.treeData, null);
    const updateList = [];
    Object.values(datas).forEach(data => {
      const defaultObj = saveObj[data.id];

      if (JSON.stringify(defaultObj) !== JSON.stringify(data)) {
        updateList.push(data)
      }
    })
    if (updateList.length > 0) {
      await updateIndex(updateList);
    }

    setTreeData(data.treeData)

  }

  const changeTree = async (newTreeData) => {
    console.log(treeData)
    console.log(newTreeData)
    console.log(JSON.stringify(newTreeData) === JSON.stringify(treeData))
    if (JSON.stringify(treeData) === JSON.stringify(newTreeData)) {

      return;
    }
    setTreeData(treeData);
  }

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }

    const sortList = arrayMoveImmutable(landmarks, oldIndex, newIndex);
    setLandmarks(sortList)
    const updateList = sortList.map((item, index) => { return { id: item.id, camera_id: item.landmark.id, index: index }; })
    console.log(updateList)
    await updateIndex(updateList);
  };

  return (
    <div style={{ width: "360px" }}>
      <SortableList useDragHandle={true}
        items={landmarks}
        handleSelectOne={handleSelectOne}
        selectedLandmarkIds={selectedLandmarkIds}
        onSortEnd={onSortEnd} />
    </div>
  );
};
