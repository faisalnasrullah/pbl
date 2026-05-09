<?php
/**
 * MANIFEST WRAPPER FOR INFINITYFREE
 * Ensures the correct Content-Type header is sent.
 */
header('Content-Type: application/manifest+json');
readfile('manifest.json');
?>
