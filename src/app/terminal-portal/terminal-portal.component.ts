import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TerminalComponent } from '../scenario/terminal.component';
import { Router } from '@angular/router';
import { VMService } from '../services/vm.service';
import { atou } from '../unicode';

@Component({
  selector: 'app-terminal-portal',
  templateUrl: './terminal-portal.component.html',
  styleUrls: ['./terminal-portal.component.css'],
})
export class TerminalPortalComponent implements OnInit {
  constructor(private route: Router, private vmService: VMService) {}
  @ViewChildren('terminalPortal')
  private terminalPortal: QueryList<TerminalComponent> = new QueryList();

  // vmName: string;

  vmName = this.route.url.split('/')[3];
  vmId = this.route.url.split('/')[5];
  endpoint = this.vmService.getWebinterfaces(this.vmId).subscribe((res) => {
    const stringContent: string = atou(res.content);
    console.log(stringContent);
  });


  ngOnInit(): void {
    console.log(this.route.url); // TO DO make directory
  }
}
