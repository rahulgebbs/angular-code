import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/service/client-configuration/client.service';
import { Token } from 'src/app/manager/token';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
@Component({
  selector: 'app-supervisor-inbox-mapping',
  templateUrl: './supervisor-inbox-mapping.component.html',
  styleUrls: ['./supervisor-inbox-mapping.component.scss']
})
export class SupervisorInboxMappingComponent implements OnInit {

  productivityForm: FormGroup;
  treeData = [
    {
      "id": 1,
      "category": "Denied",
      "count": 600,
      "isExpanded": false,
      "backupList": [
        {
          "queue": "Denial_Payer Issue",
          "count": 200,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Provider Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Patient Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Coding Issue",
          "count": 100
        }
      ],
      "queueList": [
        {
          "queue": "Denial_Payer Issue",
          "count": 200,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Provider Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Patient Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Coding Issue",
          "count": 100
        }
      ]
    },
    {
      "id": 2,
      "category": "No Response",
      "count": 500,
      "isExpanded": false,
      "backupList": [
        {
          "queue": "Denial_Payer Issue",
          "count": 200,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Provider Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Patient Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Coding Issue",
          "count": 100
        }
      ],
      "queueList": [
        {
          "queue": "Denial_Payer Issue",
          "count": 200,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Provider Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Patient Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Coding Issue",
          "count": 100
        }
      ]
    },
    {
      "id": 3,
      "category": "Rejections",
      "count": 100,
      "isExpanded": false,
      "backupList": [
        {
          "queue": "Denial_Payer Issue",
          "count": 200,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Provider Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Patient Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Coding Issue",
          "count": 100
        }
      ],
      "queueList": [
        {
          "queue": "Denial_Payer Issue",
          "count": 200,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Provider Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Patient Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Coding Issue",
          "count": 100
        }
      ]
    },
    {
      "id": 4,
      "category": "Paid",
      "count": 1200,
      "isExpanded": false,
      "backupList": [
        {
          "queue": "Denial_Payer Issue",
          "count": 200,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Provider Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Patient Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Coding Issue",
          "count": 100
        }
      ],
      "queueList": [
        {
          "queue": "Denial_Payer Issue",
          "count": 200,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Provider Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Patient Issue",
          "count": 150,
          "isExpanded": false,
          "backupList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ],
          "inboxList": [
            {
              "inbox": "110 | M42",
              "count": 30
            },
            {
              "inbox": "80 | N229",
              "count": 20
            },
            {
              "inbox": "16 | MA115",
              "count": 10
            },
            {
              "inbox": "B7 | N95",
              "count": 50
            },
            {
              "inbox": "58 | N970",
              "count": 8
            }
          ]
        },
        {
          "queue": "Denial_Coding Issue",
          "count": 100
        }
      ]
    }
  ];
  token: Token;
  userData;
  clientList = [];
  httpStatus = false;
  startDate;
  endDate;
  clientObj = null;
  ResponseHelper: ResponseHelper;
  maxDate = new Date();

  constructor(
    private clientService: ClientService,
    private router: Router,
    private notification: NotificationService,
    private fb: FormBuilder
  ) {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
    this.ResponseHelper = new ResponseHelper(this.notification);
  }
  ngOnInit() {
    // this.getClientList();
    this.initForm();
    // this.setDates();
  }

  initForm() {
    this.productivityForm = this.fb.group({
      processName: ['', Validators.required],
      reportType: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      selectedMonth: [null, Validators.required]
    });
  }


  toggleNodes(nodeObj, key) {
    // console.log('nodeObj, role : ', nodeObj, nodeObj[key], JSON.stringify(this.treeData));
    // const list = nodeObj[key];
    nodeObj.isExpanded = (nodeObj.isExpanded != undefined && nodeObj.isExpanded == true) ? false : true;
    // if (list && list.length > 0) {
    //   // alert('No '+role.toUpperCase()+' to show');
    //   return false;
    // }
    nodeObj.httpStatus = true;
    switch (key) {
      case 'queue': {
        // nodeObj.backupList = nodeObj.queueList != null && nodeObj.queueList.length > 0 ? JSON.parse(JSON.stringify(nodeObj.queueList)) : [];

        nodeObj.queueList = [];
        this.getQueues(nodeObj);
        break;
      }
      case 'inbox': {
        // nodeObj.backupList = nodeObj.inboxList != null && nodeObj.inboxList.length > 0 ? JSON.parse(JSON.stringify(nodeObj.inboxList)) : [];
        nodeObj.inboxList = [];
        this.getInboxes(nodeObj)
        break;
      }

      default:
        break;
    }
  }



  getQueues(nodeObj) {
    nodeObj.httpStatus = true;
    console.log('getQueues : ', nodeObj);
    setTimeout(() => {
      this.setQueues(nodeObj, nodeObj.backupList)
    }, 1000);
    // this.clientService.getManagerProductivityReport(this.userData.TokenValue, this.productivityForm.value['processName'], 1, this.startDate, this.endDate).subscribe((response) => {
    //   console.log('response : ', response);
    //   this.setQueues(nodeObj, response.Data.manager_InventoryList_count);
    // }, (error) => {
    //   console.log('error : ', error);
    //   nodeObj.httpStatus = false;
    //   nodeObj.refreshStatus = false;
    //   this.ResponseHelper.GetFaliureResponse(error);
    //   nodeObj.manager = [];
    // });
  }

  setQueues(nodeObj, queueList) {
    console.log('setQueues : ', nodeObj, queueList);
    queueList.forEach((element: any) => {
      // element.inboxList = []
    });
    nodeObj.queueList = queueList;
    nodeObj.httpStatus = false;
    nodeObj.refreshStatus = false;
  }

  getInboxes(nodeObj) {
    console.log('getInboxes nodeObj : ', nodeObj);
    nodeObj.httpStatus = true;
    // nodeObj.backupList = JSON.parse(JSON.stringify(nodeObj.inboxList));
    // nodeObj.inboxList = [];
    setTimeout(() => {
      this.setInboxes(nodeObj, nodeObj.backupList);
    }, 1000);
    // const { startDate, endDate } = this.productivityForm.value;
    // this.clientService.getSupervisorProductivityReport(this.userData.TokenValue, this.productivityForm.value['processName'], nodeObj.EmployeeID, 1, this.startDate, this.endDate).subscribe((response) => {
    //   console.log('response : ', response)
    //   this.setInboxes(nodeObj, response.Data.manager_InventoryList_count);
    // }, (error) => {
    //   console.log('error : ', error);
    //   nodeObj.httpStatus = false;
    //   nodeObj.supervisor = [];
    //   this.ResponseHelper.GetFaliureResponse(error);
    // })
  }

  setInboxes(nodeObj, inboxList) {
    console.log('setInboxes : ', nodeObj, inboxList);
    inboxList.forEach((element: any) => {
      // element.agent = [];
      element.managerId = nodeObj.EmployeeID;
    });
    nodeObj.inboxList = inboxList;
    nodeObj.httpStatus = false;
  }
  matchInbox(queue) {
    // console.log('matchInbox : ', queue);
    queue.inboxList.forEach((element) => {
      var result = element.inbox.indexOf(queue.inboxName);
      if (result !== -1) {
        element.show = true;
      }
      else {
        element.show = false;
      }
      // console.log('result : ', result, queue.inboxName, element.inbox)
    })
  }

}
