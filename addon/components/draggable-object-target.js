import Ember from 'ember';
import Droppable from 'ember-drag-drop/mixins/droppable';

export default Ember.Component.extend(Droppable, {
  dragCoordinator: Ember.inject.service(),
  classNameBindings: ['overrideClass'],
  overrideClass: 'draggable-object-target',

  handlePayload: function(payload) {
    var obj = this.get('coordinator').getObject(payload,{target: this});
    this.sendAction('action',obj,{target: this});
  },

  handleDrop: function(event) {
    var dataTransfer = event.dataTransfer;
    var payload = dataTransfer.getData("Text");
    this.handlePayload(payload);
  },

  acceptDrop: function(event) {
    this.handleDrop(event);
    //Firefox is navigating to a url on drop sometimes, this prevents that from happening
    event.preventDefault();
  },
  handleDragOver: function(event) {
    if (!this.get('dragCoordinator.isOver')) {
      //only send once per hover event
      this.set('dragCoordinator.isOver', true);
      this.sendAction('dragOverAction', event);
    }
  },
  handleDragOut: function(event) {
    this.set('dragCoordinator.isOver', false);
    this.sendAction('dragOutAction', event);
  },

  click(e) {
    let onClick = this.get('onClick');
    if (onClick) {
      onClick(e.originalEvent);
    }
  },

  actions: {
    acceptForDrop: function() {
      var hashId = this.get('coordinator.clickedId');
      this.handlePayload(hashId);
    }
  }
});
