import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import{ Tasks } from '../api/tasks.js';

import './task.html';

Template.task.helpers({
    isOwner(){
        return this.owner === Meteor.userId();
    }
});

Template.task.events({
    'click .delete'(){
        Meteor.call('tasks.remove', this._id);
    },
    'change .toggle-checked'(event){
        const checked = event.target.checked;
        Meteor.call('tasks.setChecked', this._id, checked);
    },
    'click .toggle-private'() {
        Meteor.call('tasks.setPrivate', this._id, !this.private);
    },
});

Template.task.onCreated(function () {
    //add your statement here
});

Template.task.onRendered(function () {
    //add your statement here
});

Template.task.onDestroyed(function () {
    //add your statement here
});

