import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('title') title: ElementRef;

  entries = []
  data = new Data('')
  thisWouldBeExported = ""
  fs: any
  remote: any
  path: any

  constructor(private router: Router) {
    if (!!(window && window.process && window.process.type)) {
      this.fs = window.require('fs');
      this.remote = window.require('electron').remote;
      this.path = window.require('path')
    }
  }

  ngOnInit(): void {
  }

  public save(newEntryForm) {
    if(newEntryForm.valid) {
      let newEntry = newEntryForm.value
      this.entries.push(new Entry(this.entries.length + 1, newEntry.title, newEntry.artist))
      newEntryForm.reset()
      this.title.nativeElement.focus()
    }
  }

  public export() {
    let dateFormat = require('dateformat');
    let today = new Date()
    let todayFormat = dateFormat(today, "yyyy-mm-dd");

    var toExport = ""

    //%track% / %title% / %artist% / %album-artist%/ %year% / %Datum% / &genre% /

    this.entries.forEach(entry => {
      toExport = toExport
        + (entry.number < 10 ? "0" : "") + entry.number.toString() + " / "
        + entry.title + " / "
        + entry.artist + " / "
        + "Mennoniten-Brüdergemeinde Warendorf / "
        + today.getFullYear() + " / "
        + this.data.album + " / "
        + todayFormat.toString() + " / " 
        + "Christlich\n"
    }
    )
    this.remote.dialog.showSaveDialog({
      defaultPath: this.path.join(__dirname, '../metadata.txt'),
      buttonLabel: 'Speichern',
      filters: [
        {
          name: 'Text Files',
          extensions: ['txt']
        },],
      properties: []
    }).then(file => {
      if (!file.canceled) {
        this.fs.writeFile(file.filePath.toString(),
          toExport, function (err) {
            if (err) throw err;
          });
      }
    })
  }

  public delete(index: number) {
    console.log("Please delete entry with index: " + index)
    this.entries.splice(index, 1)
  }
}

class Entry {
  number: number;
  title: string;
  artist: string;

  constructor(number: number, title: string, artist: string) {
    this.number = number;
    this.title = title;
    this.artist = artist;
  }
}

class Data {
  album: string;

  constructor(album: string) {
    this.album = album;
  }
}
