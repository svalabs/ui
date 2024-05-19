import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VMService } from '../services/vm.service';
import { VM } from '../VM';

@Component({
  selector: 'app-terminal-portal',
  templateUrl: './terminal-portal.component.html',
  styleUrls: ['./terminal-portal.component.css'],
})
export class TerminalPortalComponent implements OnInit {
  constructor(private route: Router, private vmService: VMService) {}

  vmName = this.route.url.split('/')[3];
  vmId = this.route.url.split('/')[5];
  endpoint = '';
  display = false;

  ngOnInit(): void {
    this.vmService.get(this.vmId, true).subscribe((vm: VM) => {
      this.endpoint = vm.ws_endpoint;
      this.display = true;
    });
  }
}
