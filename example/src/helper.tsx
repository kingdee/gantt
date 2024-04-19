import { Task } from "../../dist/types/public-types";
// const currentDate = new Date();
const task1 = [
  {
      "nc_h4u796iiui": null,
      "nocodecreatedatefield": "2024-03-13 11:06:43",
      "nc_h4u796iiui111": null,
      "nc_rjt0alfjoi": "33333232424234242342342",
      "nocodemodifydatefield": "2024-03-13 11:06:46",
      "nc_h4u796iiui11": null,
      "nocodecreatorfield": "IERP",
      "nc_h4u796iiui1": null,
      "id": "1905046221603677184",
      "nocodemodifierfield": "IERP",
      "taskItems": [
          {
              "id": "Xj6BM0wEJO",
              "name": "项目时间322332232",
              "styles": {
                  "backgroundColor": "#276FF5"
              },
              "start": new Date("2024-03-03"),
          },
          {
              "id": "GzItuUc2Cd",
              "name": "实际时间",
              "styles": {
                  "backgroundColor": "#77C404"
              }
          }
      ]
  },
  {
      "nc_h4u796iiui": "2024-03-04",
      "nocodecreatedatefield": "2024-03-13 11:01:54",
      "nc_h4u796iiui111": "2024-03-20",
      "nc_rjt0alfjoi": "工程",
      "nocodemodifydatefield": "2024-03-13 11:02:12",
      "nc_h4u796iiui11": "2024-03-20",
      "nocodecreatorfield": "IERP",
      "nc_h4u796iiui1": "2024-03-23",
      "id": "1905043921516691456",
      "nocodemodifierfield": "IERP",
      "taskItems": [
          {
              "id": "Xj6BM0wEJO",
              "name": "项目时间1",
              "styles": {
                  "backgroundColor": "#276FF5"
              },
              "start": new Date("2024-03-03"),
              "end": new Date("2024-03-23")
          },
          {
              "id": "GzItuUc2Cd",
              "name": "实际时间",
              "styles": {
                  "backgroundColor": "#77C404"
              },
              // "start": new Date("2024-03-19T16:00:00.000Z"),
              // "end": new Date("2024-03-20T15:59:59.999Z")
          }
      ]
  },
  {
      "nc_h4u796iiui": "2024-03-13",
      "nocodecreatedatefield": "2024-03-13 10:57:23",
      "nc_h4u796iiui111": "2024-03-14",
      "nc_rjt0alfjoi": "hahahh",
      "nocodemodifydatefield": "2024-03-13 10:57:37",
      "nc_h4u796iiui11": "2024-03-13",
      "nocodecreatorfield": "IERP",
      "nc_h4u796iiui1": "2024-03-11",
      "id": "1905041615748399104",
      "nocodemodifierfield": "IERP",
      "taskItems": [
          {
              "id": "Xj6BM0wEJO",
              "name": "项目时间",
              "styles": {
                  "backgroundColor": "#276FF5"
              },
              "start": new Date("2024-03-12T16:00:00.000Z"),
              "end": new Date("2024-03-11T15:59:59.999Z")
          },
          {
              "id": "GzItuUc2Cd",
              "name": "实际时间",
              "styles": {
                  "backgroundColor": "#77C404"
              },
              "start": new Date("2024-03-12T16:00:00.000Z"),
              "end": new Date("2024-03-14T15:59:59.999Z")
          }
      ]
  },
]

export function initTasks() {
  const currentDate = new Date();
  const tasks: any[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2,
        12,
        28
      ),
      start1: new Date(currentDate.getFullYear(), currentDate.getMonth(), 6),
      end1: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 5,
        8,
        12,
        28
      ),
      name: "Idea",
      id: "Task 0",
      progress: 45,
      type: "task",
      displayOrder: 2,
      taskItems: [{
        id: '1',
        name: '', // 任务条上显示的名称
        start: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
        styles: {
          backgroundColor: '#276ff5'
        },
        isDisabled: true
      }, {
        id: '2',
        name: '', // 任务条上显示的名称
        start: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 4),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 6),
        styles: {
          backgroundColor: '#ff991c'
        },
        isDisabled: true,
        dependencies: []
      }]
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: "Research",
      id: "Task 1",
      progress: 25,
      dependencies: ["Task 0"],
      type: "task",
      displayOrder: 3,
      taskItems: [{
        id: '3',
        name: '', // 任务条上显示的名称
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
        styles: {
          backgroundColor: '#276ff5'
        },
        isDisabled: true
      }, {
        id: '4',
        name: '', // 任务条上显示的名称
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 7),
        styles: {
          backgroundColor: '#ff991c'
        },
        isDisabled: true,
        dependencies: []
      }]
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "Discussion with team",
      id: "Task 2",
      progress: 10,
      dependencies: ["Task 1"],
      type: "task",
      displayOrder: 4,
      taskItems: [{
        id: '5',
        name: '', // 任务条上显示的名称
        start: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 4),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 20),
        styles: {
          backgroundColor: '#276ff5'
        },
        isDisabled: true
      }, {
        id: '6',
        name: '', // 任务条上显示的名称
        start: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 8),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 6),
        styles: {
          backgroundColor: '#ff991c'
        },
        isDisabled: true,
        dependencies: []
      }]
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      name: "Developing",
      id: "Task 3",
      progress: 2,
      dependencies: ["Task 2"],
      type: "task",
      displayOrder: 5,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      name: "Review",
      id: "Task 4",
      type: "task",
      progress: 70,
      dependencies: ["Task 2"],
      project: "ProjectSample",
      displayOrder: 6,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Release",
      id: "Task 6",
      progress: currentDate.getMonth(),
      type: "task",
      dependencies: ["Task 4"],
      displayOrder: 7,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: "Party Time",
      id: "Task 9",
      progress: 0,
      isDisabled: true,
      type: "task",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: "Party Time",
      id: "Task 10",
      progress: 0,
      isDisabled: true,
      type: "task",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: "Party Time",
      id: "Task 11",
      progress: 0,
      isDisabled: true,
      type: "task",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: "Party Time",
      id: "Task 12",
      progress: 0,
      isDisabled: true,
      type: "task",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: "Party Time",
      id: "Task 13",
      progress: 0,
      isDisabled: true,
      type: "task",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: "Party Time",
      id: "Task 14",
      progress: 0,
      isDisabled: true,
      type: "task",
    },
    // {
    //   start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
    //   end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
    //   name: "Party Time",
    //   id: "Task 15",
    //   progress: 0,
    //   isDisabled: true,
    //   type: "task",
    // },
    // {
    //   start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
    //   end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
    //   name: "Party Time",
    //   id: "Task 16",
    //   progress: 0,
    //   isDisabled: true,
    //   type: "task",
    // },
    // {
    //   start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
    //   end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
    //   name: "Party Time",
    //   id: "Task 17",
    //   progress: 0,
    //   isDisabled: true,
    //   type: "task",
    // },
    // {
    //   start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
    //   end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
    //   name: "Party Time",
    //   id: "Task 18",
    //   progress: 0,
    //   isDisabled: true,
    //   type: "task",
    // },
  ];
  console.log(tasks)
  return task1;
}

export const columns = [
  // { code: 'No', name: '序号', width: 60, align: 'center' },
  { code: 'name', name: '名称', width: 200 },
  { code: 'start', name: '开始时间', width: 200 },
  { code: 'end', name: '结束时间', width: 200 },
  { code: 'end12', name: '结束时间', width: 200 },
  // { code: 'end23', name: '结束时间', width: 200 },
  // { code: 'end45', name: '结束时间', width: 200 },
  // { code: 'end6', name: '结束时间', width: 200 },
  // { code: 'end7', name: '结束时间', width: 200 },
  // { code: 'end8', name: '结束时间', width: 200 }
]

export const columns1 = [
  {
      "align": "center",
      "name": "序号",
      "title": "序号",
      "code": "seq",
      "width": 54,
      "lock": true
  },
  {
      "dataRange": null,
      "display": true,
      "precision": 0,
      "displayProp": null,
      "scale": 0,
      "entityId": null,
      "filterFields": [],
      "innerTable": false,
      "type": "nocodetextfield",
      "isMulti": false,
      "number": "nc_rjt0alfjoi",
      "name": "工程名称",
      "locked": false,
      "formatType": null,
      "items": [],
      "maxLength": 0,
      "status": "1",
      "parent": "0",
      "children": [],
      "code": "nc_rjt0alfjoi",
      "width": 200,
      "lock": false,
      "align": "left",
      "title": {
          "type": {
              "compare": null,
              "displayName": "TableTitle"
          },
          "key": "nc_rjt0alfjoi",
          "ref": null,
          "props": {
              "title": "工程名称",
              "type": "nocodetextfield",
              "number": "nc_rjt0alfjoi",
              "align": "left"
          },
          "_owner": null,
          "_store": {}
      }
  },
  {
      "dataRange": null,
      "display": true,
      "precision": 0,
      "displayProp": null,
      "scale": 0,
      "entityId": null,
      "filterFields": [],
      "innerTable": false,
      "type": "nocodedatefield",
      "isMulti": false,
      "number": "nc_h4u796iiui",
      "name": "开始时间",
      "locked": false,
      "formatType": "1",
      "items": [],
      "maxLength": 0,
      "status": "1",
      "parent": "0",
      "children": [],
      "code": "nc_h4u796iiui",
      "width": 200,
      "lock": false,
      "align": "left",
      "title": {
          "type": {
              "compare": null,
              "displayName": "TableTitle"
          },
          "key": "nc_h4u796iiui",
          "ref": null,
          "props": {
              "title": "开始时间",
              "type": "nocodedatefield",
              "number": "nc_h4u796iiui",
              "align": "left"
          },
          "_owner": null,
          "_store": {}
      }
  },
  {
      "dataRange": null,
      "display": true,
      "precision": 0,
      "displayProp": null,
      "scale": 0,
      "entityId": null,
      "filterFields": [],
      "innerTable": false,
      "type": "nocodedatefield",
      "isMulti": false,
      "number": "nc_h4u796iiui1",
      "name": "结束时间",
      "locked": false,
      "formatType": "1",
      "items": [],
      "maxLength": 0,
      "status": "1",
      "parent": "0",
      "children": [],
      "code": "nc_h4u796iiui1",
      "width": 200,
      "lock": false,
      "align": "left",
      "title": {
          "type": {
              "compare": null,
              "displayName": "TableTitle"
          },
          "key": "nc_h4u796iiui1",
          "ref": null,
          "props": {
              "title": "结束时间",
              "type": "nocodedatefield",
              "number": "nc_h4u796iiui1",
              "align": "left"
          },
          "_owner": null,
          "_store": {}
      }
  },
  {
      "dataRange": null,
      "display": true,
      "precision": 0,
      "displayProp": null,
      "scale": 0,
      "entityId": null,
      "filterFields": [],
      "innerTable": false,
      "type": "nocodedatefield",
      "isMulti": false,
      "number": "nc_h4u796iiui11",
      "name": "实际开始时间",
      "locked": false,
      "formatType": "1",
      "items": [],
      "maxLength": 0,
      "status": "1",
      "parent": "0",
      "children": [],
      "code": "nc_h4u796iiui11",
      "width": 200,
      "lock": false,
      "align": "left",
      "title": {
          "type": {
              "compare": null,
              "displayName": "TableTitle"
          },
          "key": "nc_h4u796iiui11",
          "ref": null,
          "props": {
              "title": "实际开始时间",
              "type": "nocodedatefield",
              "number": "nc_h4u796iiui11",
              "align": "left"
          },
          "_owner": null,
          "_store": {}
      }
  },
  {
      "dataRange": null,
      "display": true,
      "precision": 0,
      "displayProp": null,
      "scale": 0,
      "entityId": null,
      "filterFields": [],
      "innerTable": false,
      "type": "nocodedatefield",
      "isMulti": false,
      "number": "nc_h4u796iiui111",
      "name": "实际结束时间",
      "locked": false,
      "formatType": "1",
      "items": [],
      "maxLength": 0,
      "status": "1",
      "parent": "0",
      "children": [],
      "code": "nc_h4u796iiui111",
      "width": 200,
      "lock": false,
      "align": "left",
      "title": {
          "type": {
              "compare": null,
              "displayName": "TableTitle"
          },
          "key": "nc_h4u796iiui111",
          "ref": null,
          "props": {
              "title": "实际结束时间",
              "type": "nocodedatefield",
              "number": "nc_h4u796iiui111",
              "align": "left"
          },
          "_owner": null,
          "_store": {}
      }
  },
  {
      "dataRange": null,
      "display": true,
      "precision": 0,
      "displayProp": "name,number,gender,phone,email",
      "scale": 0,
      "entityId": "68bde9ca00000eac",
      "filterFields": [],
      "innerTable": false,
      "type": "nocodecreatorfield",
      "isMulti": false,
      "number": "nocodecreatorfield",
      "name": "创建人",
      "locked": false,
      "formatType": null,
      "items": [],
      "maxLength": 0,
      "status": "1",
      "parent": "0",
      "children": [],
      "code": "nocodecreatorfield",
      "width": 200,
      "lock": false,
      "align": "left",
      "title": {
          "type": {
              "compare": null,
              "displayName": "TableTitle"
          },
          "key": "nocodecreatorfield",
          "ref": null,
          "props": {
              "title": "创建人",
              "type": "nocodecreatorfield",
              "number": "nocodecreatorfield",
              "align": "left"
          },
          "_owner": null,
          "_store": {}
      }
  },
  {
      "dataRange": null,
      "display": true,
      "precision": 0,
      "displayProp": null,
      "scale": 0,
      "entityId": null,
      "filterFields": [],
      "innerTable": false,
      "type": "nocodecreatedatefield",
      "isMulti": false,
      "number": "nocodecreatedatefield",
      "name": "创建日期",
      "locked": false,
      "formatType": "0",
      "items": [],
      "maxLength": 0,
      "status": "1",
      "parent": "0",
      "children": [],
      "code": "nocodecreatedatefield",
      "width": 200,
      "lock": false,
      "align": "left",
      "title": {
          "type": {
              "compare": null,
              "displayName": "TableTitle"
          },
          "key": "nocodecreatedatefield",
          "ref": null,
          "props": {
              "title": "创建日期",
              "type": "nocodecreatedatefield",
              "number": "nocodecreatedatefield",
              "align": "left"
          },
          "_owner": null,
          "_store": {}
      }
  },
  {
      "dataRange": null,
      "display": true,
      "precision": 0,
      "displayProp": "name,number,gender,phone,email",
      "scale": 0,
      "entityId": "68bde9ca00000eac",
      "filterFields": [],
      "innerTable": false,
      "type": "nocodemodifierfield",
      "isMulti": false,
      "number": "nocodemodifierfield",
      "name": "修改人",
      "locked": false,
      "formatType": null,
      "items": [],
      "maxLength": 0,
      "status": "1",
      "parent": "0",
      "children": [],
      "code": "nocodemodifierfield",
      "width": 200,
      "lock": false,
      "align": "left",
      "title": {
          "type": {
              "compare": null,
              "displayName": "TableTitle"
          },
          "key": "nocodemodifierfield",
          "ref": null,
          "props": {
              "title": "修改人",
              "type": "nocodemodifierfield",
              "number": "nocodemodifierfield",
              "align": "left"
          },
          "_owner": null,
          "_store": {}
      }
  },
  {
      "dataRange": null,
      "display": true,
      "precision": 0,
      "displayProp": null,
      "scale": 0,
      "entityId": null,
      "filterFields": [],
      "innerTable": false,
      "type": "nocodemodifydatefield",
      "isMulti": false,
      "number": "nocodemodifydatefield",
      "name": "修改日期",
      "locked": false,
      "formatType": "0",
      "items": [],
      "maxLength": 0,
      "status": "1",
      "parent": "0",
      "children": [],
      "code": "nocodemodifydatefield",
      "width": 200,
      "lock": false,
      "align": "left",
      "title": {
          "type": {
              "compare": null,
              "displayName": "TableTitle"
          },
          "key": "nocodemodifydatefield",
          "ref": null,
          "props": {
              "title": "修改日期",
              "type": "nocodemodifydatefield",
              "number": "nocodemodifydatefield",
              "align": "left"
          },
          "_owner": null,
          "_store": {}
      }
  },
  {
      "code": "operate",
      "name": "操作",
      "width": 200,
      "align": "left",
      "lock": true,
      "title": {
          "type": {
              "compare": null,
              "displayName": "TableTitle"
          },
          "key": null,
          "ref": null,
          "props": {
              "title": "操作",
              "type": "operate"
          },
          "_owner": null,
          "_store": {}
      },
      "operate": true,
      "type": "operate"
  }
]

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter(t => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}
