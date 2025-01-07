import os
import shutil
import time
from pathlib import Path
from typing import Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def cleanup_old_files(directory: str, max_age_minutes: int = 30) -> None:
    """
    Remove files and folders older than max_age_minutes from the specified directory.
    
    Args:
        directory (str): Path to the directory to clean
        max_age_minutes (int): Maximum age of files in minutes before they are deleted
    """
    try:
        directory_path = Path(directory)
        if not directory_path.exists():
            logger.warning(f"Directory {directory} does not exist")
            return

        current_time = time.time()
        max_age_seconds = max_age_minutes * 60

        for item in directory_path.iterdir():
            try:
                item_age = current_time - item.stat().st_mtime
                if item_age > max_age_seconds:
                    if item.is_file():
                        item.unlink()
                        logger.info(f"Deleted old file: {item}")
                    elif item.is_dir():
                        shutil.rmtree(item)
                        logger.info(f"Deleted old directory: {item}")
            except Exception as e:
                logger.error(f"Error cleaning up {item}: {str(e)}")

    except Exception as e:
        logger.error(f"Error during cleanup: {str(e)}")

def cleanup_podcast_files(podcast_id: str, output_dir: str) -> None:
    """
    Remove all files and folders related to a specific podcast.
    
    Args:
        podcast_id (str): ID of the podcast to clean up
        output_dir (str): Base directory for podcast output
    """
    try:
        # Remove the podcast directory
        podcast_dir = Path(output_dir) / podcast_id
        if podcast_dir.exists():
            shutil.rmtree(podcast_dir)
            logger.info(f"Cleaned up podcast directory: {podcast_dir}")
            
        # Remove any associated script files
        script_file = Path(output_dir) / f"{podcast_id}_script.json"
        if script_file.exists():
            script_file.unlink()
            logger.info(f"Cleaned up script file: {script_file}")
            
    except Exception as e:
        logger.error(f"Error cleaning up podcast {podcast_id}: {str(e)}")
