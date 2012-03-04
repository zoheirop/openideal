<?php

/**
 * Argument handler to accept a user id to check for nodes that
 * user posted or commented on.
 */
class views_handler_argument_comment_only_user_uid extends views_handler_argument {
  function title() {
    if (!$this->argument) {
      $title = variable_get('anonymous', t('Anonymous'));
    }
    else {
      $title = db_query("SELECT u.name FROM {users} u WHERE u.uid = :uid", array(':uid' => $this->argument))->fetchField();
    }
    if (empty($title)) {
      return t('No user');
    }

    return check_plain($title);
  }

  function default_actions($which = NULL) {
    // Disallow summary views on this argument.
    if (!$which) {
      $actions = parent::default_actions();
      unset($actions['summary asc']);
      unset($actions['summary desc']);
      return $actions;
    }

    if ($which != 'summary asc' && $which != 'summary desc') {
      return parent::default_actions($which);
    }
  }

  function query($group_by = FALSE) {
    $this->ensure_my_table();

    $subselect = db_select('votingapi_vote', 'v');
    $subselect->addField('v', 'vote_id');
    $subselect->condition('v.uid', $this->argument);
    $subselect->where("v.entity_id = $this->table_alias.nid");

    $condition = db_or()
      ->exists($subselect);

    $this->query->add_where(0, $condition);
  }
}
  
  
 /* function query() {
    $this->ensure_my_table();
    //$this->query->add_where(0, "$this->table_alias.uid = %d OR ((SELECT COUNT(*) FROM {comments} c WHERE c.uid = %d AND c.nid = $this->table_alias.nid) > 0)", $this->argument, $this->argument);
    $this->query->add_where(0,
    "((SELECT COUNT(*)
    FROM {comments} c
    WHERE c.uid = %d
    AND c.nid = $this->table_alias.nid) > 0
    OR
    (SELECT COUNT(*)
    FROM {votingapi_vote} v
    WHERE v.uid =  %d
    AND v.content_id = $this->table_alias.nid) > 0)
    AND $this->table_alias.uid <> %d",
    $this->argument, $this->argument,   $this->argument);
  }
}*/