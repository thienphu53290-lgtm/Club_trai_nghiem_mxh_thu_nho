<?php
var_dump(getenv('TEST_VAR'), $_ENV['TEST_VAR'] ?? null, $_SERVER['TEST_VAR'] ?? null);
