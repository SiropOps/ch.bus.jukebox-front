import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { JukeboxComponent } from './jukebox.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [JukeboxComponent],
    imports: [BrowserModule, HttpClientModule, FormsModule, RouterModule.forRoot([]),],
    bootstrap: [JukeboxComponent]
})
export class AppModule { }